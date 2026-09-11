import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { vi } from 'vitest';
import Kanji from '../../../../../Models/Kanji';
import { EditKanjiComponent } from './edit-kanji.component';

function chipEvent(value: string) {
  return { value, chipInput: { clear: () => {} } } as unknown as Parameters<EditKanjiComponent['addKunyomi']>[0];
}

describe('EditKanjiComponent', () => {
  let component: EditKanjiComponent;
  let fixture: ComponentFixture<EditKanjiComponent>;
  let kanji: Kanji;

  beforeEach(() => {
    kanji = new Kanji('一', ['いち'], ['イチ']);

    TestBed.configureTestingModule({
      imports: [EditKanjiComponent]
    });

    fixture = TestBed.createComponent(EditKanjiComponent);
    component = fixture.componentInstance;
    component.kanji = kanji;
    component.myIndex = 0;
    fixture.detectChanges();
  });

  it('creates and sets the kanji control value from ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(component.kanjiControl.value).toBe('一');
  });

  it('removes an existing kunyomi and emits change', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);

    component.removeKunyomi('いち');

    expect(kanji.kunyomi).toEqual([]);
    expect(emitSpy).toHaveBeenCalledWith({ kanji, index: 0 });
  });

  it('does nothing when removing a kunyomi that does not exist', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);

    component.removeKunyomi('missing');

    expect(kanji.kunyomi).toEqual(['いち']);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('adds a valid new kunyomi and clears the input', () => {
    const clear = vi.fn();
    const event = { value: 'に', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addKunyomi']>[0];

    component.addKunyomi(event);

    expect(kanji.kunyomi).toEqual(['いち', 'に']);
    expect(clear).toHaveBeenCalled();
  });

  it('does not add kunyomi when the control is invalid', () => {
    component.kunyomiControl.setErrors({ pattern: true });
    const clear = vi.fn();
    const event = { value: 'カタカナ', chipInput: { clear } } as unknown as Parameters<
      EditKanjiComponent['addKunyomi']
    >[0];

    component.addKunyomi(event);

    expect(kanji.kunyomi).toEqual(['いち']);
    expect(clear).not.toHaveBeenCalled();
  });

  it('does not add a duplicate kunyomi', () => {
    const event = chipEvent('いち');

    component.addKunyomi(event);

    expect(kanji.kunyomi).toEqual(['いち']);
  });

  it('does not add an empty kunyomi value', () => {
    const clear = vi.fn();
    const event = { value: '', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addKunyomi']>[0];

    component.addKunyomi(event);

    expect(kanji.kunyomi).toEqual(['いち']);
    expect(clear).toHaveBeenCalled();
  });

  it('removes an existing onyomi and emits change', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);

    component.removeOnyomi('イチ');

    expect(kanji.onyomi).toEqual([]);
    expect(emitSpy).toHaveBeenCalledWith({ kanji, index: 0 });
  });

  it('does nothing when removing an onyomi that does not exist', () => {
    component.removeOnyomi('missing');
    expect(kanji.onyomi).toEqual(['イチ']);
  });

  it('adds a valid new onyomi and clears the input', () => {
    const clear = vi.fn();
    const event = { value: 'ニ', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addOnyomi']>[0];

    component.addOnyomi(event);

    expect(kanji.onyomi).toEqual(['イチ', 'ニ']);
    expect(clear).toHaveBeenCalled();
  });

  it('does not add onyomi when the control is invalid', () => {
    component.onyomiControl.setErrors({ pattern: true });
    const clear = vi.fn();
    const event = { value: 'ニ', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addOnyomi']>[0];

    component.addOnyomi(event);

    expect(kanji.onyomi).toEqual(['イチ']);
    expect(clear).not.toHaveBeenCalled();
  });

  it('does not add an onyomi already present in kunyomi', () => {
    const clear = vi.fn();
    const event = { value: 'いち', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addOnyomi']>[0];

    component.addOnyomi(event);

    expect(kanji.onyomi).toEqual(['イチ']);
  });

  it('does not add an empty onyomi value', () => {
    const clear = vi.fn();
    const event = { value: '', chipInput: { clear } } as unknown as Parameters<EditKanjiComponent['addOnyomi']>[0];

    component.addOnyomi(event);

    expect(kanji.onyomi).toEqual(['イチ']);
    expect(clear).toHaveBeenCalled();
  });

  it('emits its index on remove click', () => {
    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);

    component.onRemoveClicked();

    expect(removeSpy).toHaveBeenCalledWith(0);
  });

  it('returns error messages for kunyomi and onyomi field types, and unknown otherwise', () => {
    expect(component.getFieldError('kunyomi')).toBe('Only hiragana chars with size less than 10 can be inputed');
    expect(component.getFieldError('onyomi')).toBe('Only katakana chars with size less than 10 can be inputed');
    expect(component.getFieldError('other')).toBe('Unknown error');
  });

  it('removeError is a no-op branch switch that does not throw for both types', () => {
    expect(() => component.removeError('kunyomi')).not.toThrow();
    expect(() => component.removeError('onyomi')).not.toThrow();
    expect(() => component.removeError('other')).not.toThrow();
  });

  it('emits kanjiChange with the current kanji and index', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);

    component.emitKanjiChange(kanji);

    expect(emitSpy).toHaveBeenCalledWith({ kanji, index: 0 });
  });

  it('returns kanji-specific error messages', () => {
    component.kanjiControl.setErrors({ required: true });
    expect(component.getKanjiError()).toBe('Required');

    component.kanjiControl.setErrors({ maxlength: true });
    expect(component.getKanjiError()).toBe('Max length is 1 char');

    component.kanjiControl.setErrors({ pattern: true });
    expect(component.getKanjiError()).toBe('Kanji only');

    component.kanjiControl.setErrors({ other: true });
    expect(component.getKanjiError()).toBe('Unknown error');
  });

  it('updates the kanji char and emits change when valid', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);
    component.kanjiControl.setValue('二');

    component.onKanjiCharChanged();

    expect(kanji.kanji).toBe('二');
    expect(emitSpy).toHaveBeenCalledWith({ kanji, index: 0 });
  });

  it('does not update the kanji char when the control is invalid', () => {
    component.kanjiControl.setErrors({ required: true });
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);

    component.onKanjiCharChanged();

    expect(kanji.kanji).toBe('一');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('updates the kanji char when the kanji input emits change', () => {
    const emitSpy = vi.fn();
    component.kanjiChange.subscribe(emitSpy);
    const kanjiInput = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    component.kanjiControl.setValue('二');
    kanjiInput.value = '二';

    kanjiInput.dispatchEvent(new Event('change'));

    expect(kanji.kanji).toBe('二');
    expect(emitSpy).toHaveBeenCalledWith({ kanji, index: 0 });
  });

  it('removes a kunyomi reading via its chip remove button', () => {
    const chipRemoveButton = fixture.nativeElement.querySelector('mat-chip-row button') as HTMLButtonElement;

    chipRemoveButton.click();

    expect(kanji.kunyomi).toEqual([]);
  });

  it('removes an onyomi reading via its chip remove button', () => {
    const chipRemoveButtons = fixture.nativeElement.querySelectorAll(
      'mat-chip-row button'
    ) as NodeListOf<HTMLButtonElement>;

    chipRemoveButtons[1].click();

    expect(kanji.onyomi).toEqual([]);
  });

  it('handles focus and chip input token end on the kunyomi input', () => {
    const kunyomiInput = fixture.nativeElement.querySelectorAll('input')[1] as HTMLInputElement;
    const chipInput = fixture.debugElement.queryAll(By.directive(MatChipInput))[0].injector.get(MatChipInput);

    kunyomiInput.dispatchEvent(new Event('focusin'));
    chipInput.chipEnd.emit({ input: kunyomiInput, value: 'に', chipInput } as unknown as MatChipInputEvent);

    expect(kanji.kunyomi).toEqual(['いち', 'に']);
  });

  it('handles focus and chip input token end on the onyomi input', () => {
    const onyomiInput = fixture.nativeElement.querySelectorAll('input')[2] as HTMLInputElement;
    const chipInput = fixture.debugElement.queryAll(By.directive(MatChipInput))[1].injector.get(MatChipInput);

    onyomiInput.dispatchEvent(new Event('focusin'));
    chipInput.chipEnd.emit({ input: onyomiInput, value: 'ニ', chipInput } as unknown as MatChipInputEvent);

    expect(kanji.onyomi).toEqual(['イチ', 'ニ']);
  });

  it('emits its index when the remove button is clicked', () => {
    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);
    fixture.componentRef.setInput('isRemoveAvailable', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement;
    button.click();

    expect(removeSpy).toHaveBeenCalledWith(0);
  });
});
