import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import Set from '../../../../Models/Set';
import { SetComponent } from './set.component';
import { RemoveConfirmationDialogComponent } from '../RemoveConfirmationDialog/remove-confirmation-dialog.component';
import { DialogProperties, OpenMode, SetDialogComponent } from '../SetDialog/set-dialog.component';
import { DialogData, SetPreviewDialogComponent } from '../SetPreview/set-preview-dialog.component';
import { startStudying } from '../../../../Redux/Actions/set-study.actions';
import { MySetsService } from '../../../../Services/my-sets.service';
import { addSetSuccess } from '../../../../Redux/Actions/snackbar.actions';
import { loadMySetsFailure } from '../../../../Redux/Actions/my-sets.actions';

describe('SetComponent', () => {
  let component: SetComponent;
  let fixture: ComponentFixture<SetComponent>;
  let dialog: { open: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let store: { dispatch: ReturnType<typeof vi.fn> };
  let mySetsService: { addSet: ReturnType<typeof vi.fn> };
  let set: Set;

  function buttonByText(text: string) {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    return buttons.find(button => button.textContent?.trim() === text) as HTMLButtonElement;
  }

  beforeEach(() => {
    set = new Set('1', 'Name', 'Description');

    router = { navigate: vi.fn().mockResolvedValue(true) };
    store = { dispatch: vi.fn() };
    mySetsService = { addSet: vi.fn() };

    TestBed.configureTestingModule({
      imports: [SetComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: Store, useValue: store },
        { provide: MySetsService, useValue: mySetsService }
      ]
    });

    fixture = TestBed.createComponent(SetComponent);
    component = fixture.componentInstance;

    // MatDialogModule is imported by SetComponent itself, so its component-level
    // MatDialog provider shadows any TestBed-level mock; the open method of the
    // instance the component injects is spied on instead.
    const injectedDialog = fixture.debugElement.injector.get(MatDialog);
    dialog = { open: vi.spyOn(injectedDialog, 'open') };
    component.set = set;
    component.mode = 'owner';
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders the set details and the owner actions', () => {
    expect(fixture.nativeElement.textContent).toContain('Name');
    expect(fixture.nativeElement.textContent).toContain('Description');
    expect(buttonByText('Preview')).toBeTruthy();
    expect(buttonByText('Edit')).toBeTruthy();
    expect(buttonByText('Study!')).toBeTruthy();
  });

  it('opens the remove confirmation dialog and emits remove when confirmed', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(true) });
    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);

    (fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement).click();

    expect(dialog.open).toHaveBeenCalledWith(RemoveConfirmationDialogComponent);
    expect(removeSpy).toHaveBeenCalledWith('1');
  });

  it('does not emit remove when the dialog is dismissed', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(false) });
    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);

    component.onRemoveClicked('1');

    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('opens SetDialogComponent in edit mode and emits setChange when a set is returned', () => {
    const editedSet = new Set('1', 'Edited');
    dialog.open.mockReturnValue({ afterClosed: () => of(editedSet) });
    const setChangeSpy = vi.fn();
    component.setChange.subscribe(setChangeSpy);

    buttonByText('Edit').click();

    expect(dialog.open).toHaveBeenCalledWith(
      SetDialogComponent,
      expect.objectContaining({ data: new DialogProperties(OpenMode.edit, set) })
    );
    expect(setChangeSpy).toHaveBeenCalledWith(editedSet);
  });

  it('does not emit setChange when the edit dialog returns undefined', () => {
    const setChangeSpy = vi.fn();
    component.setChange.subscribe(setChangeSpy);

    component.onSetChanged(undefined);

    expect(setChangeSpy).not.toHaveBeenCalled();
  });

  it('dispatches startStudying and navigates when the Study button is clicked', () => {
    buttonByText('Study!').click();

    expect(store.dispatch).toHaveBeenCalledWith(startStudying({ set }));
    expect(router.navigate).toHaveBeenCalledWith(['hub', 'study']);
  });

  it('dispatches addSetSuccess when the Add button is clicked in notOwner mode', () => {
    mySetsService.addSet.mockReturnValue(of(set));
    fixture.componentRef.setInput('mode', 'notOwner');
    fixture.detectChanges();

    buttonByText('Add').click();

    expect(mySetsService.addSet).toHaveBeenCalledWith(set);
    expect(store.dispatch).toHaveBeenCalledWith(addSetSuccess());
  });

  it('dispatches loadMySetsFailure when addSet errors', () => {
    mySetsService.addSet.mockReturnValue(throwError(() => ({ error: 'boom' })));

    component.onAddClicked();

    expect(store.dispatch).toHaveBeenCalledWith(loadMySetsFailure({ errorMessage: 'boom' }));
  });

  it('opens SetPreviewDialogComponent with the kanji list when Preview is clicked', () => {
    buttonByText('Preview').click();

    expect(dialog.open).toHaveBeenCalledWith(
      SetPreviewDialogComponent,
      expect.objectContaining({ data: new DialogData(set.kanjiList), width: '40vw' })
    );
  });
});
