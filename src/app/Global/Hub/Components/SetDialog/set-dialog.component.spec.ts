import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Kanji from '../../../../Models/Kanji';
import Set from '../../../../Models/Set';
import { DialogProperties, OpenMode, SetDialogComponent } from './set-dialog.component';
import { EditKanjiListComponent } from './EditKanjiList/edit-kanji-list.component';

describe('SetDialogComponent', () => {
  let component: SetDialogComponent;
  let fixture: ComponentFixture<SetDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let set: Set;

  function setUp(mode: OpenMode) {
    TestBed.configureTestingModule({
      imports: [SetDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: new DialogProperties(mode, set) },
        provideNoopAnimations()
      ]
    });

    fixture = TestBed.createComponent(SetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function buttonByText(text: string) {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    return buttons.find(button => button.textContent?.trim() === text) as HTMLButtonElement;
  }

  beforeEach(() => {
    dialogRef = { close: vi.fn() };
    set = new Set('1', 'Valid Name', 'Valid description', 'author', 'authorId', [new Kanji('一', ['いち'], ['イチ'])]);
  });

  it('creates in create mode', () => {
    setUp(OpenMode.create);
    expect(component).toBeTruthy();
    expect(component.mode).toBe(OpenMode.create);
    expect(component.isFinishAvailable).toBe(false);
  });

  it('closes without value when the Back button is clicked', () => {
    setUp(OpenMode.edit);

    buttonByText('Back').click();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('closes with the updated set on onFinishClicked when the form is valid', () => {
    setUp(OpenMode.edit);
    component.setFormGroup.controls.nameControl.setValue('New Name');
    component.setFormGroup.controls.descriptionControl.setValue('New description');

    component.onFinishClicked();

    expect(component.set.name).toBe('New Name');
    expect(component.set.description).toBe('New description');
    expect(dialogRef.close).toHaveBeenCalledWith(component.set);
  });

  it('marks all controls as touched when the form is invalid on finish', () => {
    setUp(OpenMode.edit);
    component.setFormGroup.controls.nameControl.setValue('');

    component.onFinishClicked();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.setFormGroup.controls.nameControl.touched).toBe(true);
  });

  it('updates isFinishAvailable on field change based on form validity and kanji list', () => {
    setUp(OpenMode.edit);
    component.setFormGroup.controls.nameControl.setValue('Valid Name');
    component.setFormGroup.controls.descriptionControl.setValue('Valid description');

    component.onFieldChange();

    expect(component.isFinishAvailable).toBe(true);
  });

  it('recomputes isFinishAvailable when the name and description fields emit keyup', () => {
    setUp(OpenMode.edit);
    const nameInput = fixture.nativeElement.querySelector('input[formcontrolname="nameControl"]');
    const descriptionInput = fixture.nativeElement.querySelector('input[formcontrolname="descriptionControl"]');

    nameInput.dispatchEvent(new Event('keyup'));
    descriptionInput.dispatchEvent(new Event('keyup'));

    expect(component.isFinishAvailable).toBe(true);
  });

  it('onFieldChange is false when kanji list is incorrect', () => {
    setUp(OpenMode.edit);
    component.set.kanjiList = [new Kanji('', [], [])];
    component.setFormGroup.controls.nameControl.setValue('Valid Name');
    component.setFormGroup.controls.descriptionControl.setValue('Valid description');

    component.onFieldChange();

    expect(component.isFinishAvailable).toBe(false);
  });

  it('onKanjiListChange updates isFinishAvailable', () => {
    setUp(OpenMode.edit);
    component.setFormGroup.controls.nameControl.setValue('Valid Name');
    component.setFormGroup.controls.descriptionControl.setValue('Valid description');

    component.onKanjiListChange([new Kanji('一', ['いち'], [])]);
    expect(component.isFinishAvailable).toBe(true);

    component.onKanjiListChange([new Kanji('', [], [])]);
    expect(component.isFinishAvailable).toBe(false);
  });

  it('recomputes isFinishAvailable when the kanji list child emits a change', () => {
    setUp(OpenMode.edit);
    const child = fixture.debugElement.query(By.directive(EditKanjiListComponent)).componentInstance;
    const kanjiListChange = child.kanjiListChange as EditKanjiListComponent['kanjiListChange'];

    kanjiListChange.emit([new Kanji('一', ['いち'], [])]);

    expect(component.isFinishAvailable).toBe(true);
  });

  it('closes with the set when the Create button is clicked in create mode', () => {
    setUp(OpenMode.create);
    const nameInput = fixture.nativeElement.querySelector('input[formcontrolname="nameControl"]');
    nameInput.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    buttonByText('Create').click();

    expect(dialogRef.close).toHaveBeenCalledWith(component.set);
  });

  it('closes with the set when the Edit button is clicked in edit mode', () => {
    setUp(OpenMode.edit);
    const nameInput = fixture.nativeElement.querySelector('input[formcontrolname="nameControl"]');
    nameInput.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    buttonByText('Edit').click();

    expect(dialogRef.close).toHaveBeenCalledWith(component.set);
  });

  describe('isListCorrect', () => {
    beforeEach(() => setUp(OpenMode.edit));

    it('returns true when every kanji has a char and at least one reading', () => {
      expect(component.isListCorrect([new Kanji('一', ['いち'], [])])).toBe(true);
      expect(component.isListCorrect([new Kanji('一', [], ['イチ'])])).toBe(true);
    });

    it('returns false when a kanji char is empty', () => {
      expect(component.isListCorrect([new Kanji('', ['いち'], [])])).toBe(false);
    });

    it('returns false when a kanji has no readings at all', () => {
      expect(component.isListCorrect([new Kanji('一', [], [])])).toBe(false);
    });
  });

  describe('getNameErrorMessage', () => {
    beforeEach(() => setUp(OpenMode.edit));

    it('returns required message', () => {
      component.setFormGroup.controls.nameControl.setValue('');
      expect(component.getNameErrorMessage()).toBe('This field is required');
    });

    it('returns minlength message', () => {
      component.setFormGroup.controls.nameControl.setValue('ab');
      expect(component.getNameErrorMessage()).toBe('This field must be at least 3 chars long');
    });

    it('returns maxlength message', () => {
      component.setFormGroup.controls.nameControl.setValue('a'.repeat(16));
      expect(component.getNameErrorMessage()).toBe('This field must be not longer than 15 chars');
    });

    it('returns unknown error message when the control has an unmapped error', () => {
      component.setFormGroup.controls.nameControl.setValue('Valid Name');
      component.setFormGroup.controls.nameControl.setErrors({ custom: true });
      expect(component.getNameErrorMessage()).toBe('Unknown error');
    });
  });

  describe('getDescriptionErrorMessage', () => {
    beforeEach(() => setUp(OpenMode.edit));

    it('returns required message', () => {
      component.setFormGroup.controls.descriptionControl.setValue('');
      expect(component.getDescriptionErrorMessage()).toBe('This field is required');
    });

    it('returns maxlength message', () => {
      component.setFormGroup.controls.descriptionControl.setValue('a'.repeat(91));
      expect(component.getDescriptionErrorMessage()).toBe('This field must be not longer than 90 chars');
    });

    it('returns unknown error message when the control has an unmapped error', () => {
      component.setFormGroup.controls.descriptionControl.setValue('Valid description');
      component.setFormGroup.controls.descriptionControl.setErrors({ custom: true });
      expect(component.getDescriptionErrorMessage()).toBe('Unknown error');
    });
  });
});
