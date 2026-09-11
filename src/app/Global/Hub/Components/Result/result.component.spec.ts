import { ComponentFixture, TestBed } from '@angular/core/testing';
import Answer from '../../../../Models/Answer';
import Kanji from '../../../../Models/Kanji';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResultComponent] });
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
  });

  it('marks the answer correct when the user matched every reading exactly', () => {
    component.answer = new Answer(new Kanji('一', ['いち'], ['イチ']), ['いち'], ['イチ']);
    fixture.detectChanges();

    expect(component.isCorrect).toBe(true);
    expect(component.matchedKunyomi).toEqual(['いち']);
    expect(component.matchedOnyomi).toEqual(['イチ']);
    expect(component.unmatchedKunyomi).toEqual([]);
    expect(component.unmatchedOnyomi).toEqual([]);
    expect(component.incorrectKunyomi).toEqual([]);
    expect(component.incorrectOnyomi).toEqual([]);
    expect(fixture.nativeElement.querySelector('.container').classList.contains('correct')).toBe(true);
  });

  it('marks the answer incorrect when a required kunyomi reading was missed', () => {
    component.answer = new Answer(new Kanji('一', ['いち', 'ひと'], ['イチ']), ['いち'], ['イチ']);
    fixture.detectChanges();

    expect(component.isCorrect).toBe(false);
    expect(component.unmatchedKunyomi).toEqual(['ひと']);
    expect(fixture.nativeElement.querySelector('.container').classList.contains('incorrect')).toBe(true);
  });

  it('flags user-selected readings that are not part of the correct answer as incorrect', () => {
    component.answer = new Answer(new Kanji('一', ['いち'], ['イチ']), ['いち', 'ふん'], ['イチ']);
    fixture.detectChanges();

    expect(component.isCorrect).toBe(false);
    expect(component.incorrectKunyomi).toEqual(['ふん']);
  });

  it('flags user-selected onyomi readings that are not part of the correct answer', () => {
    component.answer = new Answer(new Kanji('一', ['いち'], ['イチ']), ['いち'], ['イチ', 'オツ']);
    fixture.detectChanges();

    expect(component.isCorrect).toBe(false);
    expect(component.incorrectOnyomi).toEqual(['オツ']);
  });

  it('renders result-reading entries for matched, unmatched and incorrect readings', () => {
    component.answer = new Answer(new Kanji('一', ['いち', 'ひと'], ['イチ']), ['いち', 'ふん'], []);
    fixture.detectChanges();

    const entries = fixture.nativeElement.querySelectorAll('app-result-reading');
    // matchedKunyomi(1) + unmatchedKunyomi(1) + incorrectKunyomi(1) + unmatchedOnyomi(1)
    expect(entries.length).toBe(4);
  });
});
