import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import Kanji from '../../../../../Models/Kanji';
import { EditKanjiComponent } from '../EditKanji/edit-kanji.component';
import { EditKanjiListComponent } from './edit-kanji-list.component';

describe('EditKanjiListComponent', () => {
  let component: EditKanjiListComponent;
  let fixture: ComponentFixture<EditKanjiListComponent>;
  let kanjiList: Kanji[];

  function firstChild(): EditKanjiComponent {
    return fixture.debugElement.query(By.directive(EditKanjiComponent)).componentInstance as EditKanjiComponent;
  }

  beforeEach(() => {
    kanjiList = [new Kanji('一', ['いち'], []), new Kanji('二', ['に'], [])];

    TestBed.configureTestingModule({
      imports: [EditKanjiListComponent],
      providers: [provideNoopAnimations()]
    });

    fixture = TestBed.createComponent(EditKanjiListComponent);
    component = fixture.componentInstance;
    component.kanjiList = kanjiList;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('adds a new blank kanji when the add button is clicked', () => {
    const addButton = fixture.nativeElement.querySelector('.kanjiList > button') as HTMLButtonElement;

    addButton.click();

    expect(component.kanjiList.length).toBe(3);
    expect(component.kanjiList[2]).toEqual(new Kanji());
  });

  it('removes the kanji at the given index on onRemoveKanji', () => {
    const remainingKanji = kanjiList[1];

    component.onRemoveKanji(0);

    expect(component.kanjiList).toEqual([remainingKanji]);
  });

  it('removes the kanji when a child emits remove', () => {
    const remainingKanji = kanjiList[1];

    firstChild().remove.emit(0);

    expect(component.kanjiList).toEqual([remainingKanji]);
  });

  it('replaces the kanji and emits the updated list when a child emits kanjiChange', () => {
    const emitSpy = vi.fn();
    component.kanjiListChange.subscribe(emitSpy);
    const newKanji = new Kanji('三', ['さん'], []);

    firstChild().kanjiChange.emit({ kanji: newKanji, index: 1 });

    expect(component.kanjiList[1]).toBe(newKanji);
    expect(emitSpy).toHaveBeenCalledWith(component.kanjiList);
  });
});
