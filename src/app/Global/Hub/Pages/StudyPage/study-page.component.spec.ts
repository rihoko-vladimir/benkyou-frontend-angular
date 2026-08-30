import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import Answer from '../../../../Models/Answer';
import Kanji from '../../../../Models/Kanji';
import { nextKanji } from '../../../../Redux/Actions/set-study.actions';
import { IStudyState } from '../../../../Redux/Reducers/set-study.reducer';
import { KanjiSvgDrawingPreviewComponent } from '../../Components/KanjiSvgDrawingPreview/kanji-svg-drawing-preview.component';
import { StudyPageComponent } from './study-page.component';

describe('StudyPageComponent', () => {
  let component: StudyPageComponent;
  let fixture: ComponentFixture<StudyPageComponent>;
  let store: jasmine.SpyObj<Store>;
  let studyState: IStudyState;

  beforeEach(() => {
    studyState = {
      currentStep: 0,
      length: 3,
      currentKanji: new Kanji('一', ['いち', 'ひと'], ['イチ']),
      currentRandomReadings: ['イチ', 'に', 'いち', 'ニ', 'ひと', 'サン'],
      kanjiList: [
        new Kanji('一', ['いち', 'ひと'], ['イチ']),
        new Kanji('二', ['に'], ['ニ']),
        new Kanji('三', ['さん'], ['サン'])
      ],
      answerList: []
    };

    store = jasmine.createSpyObj<Store>('store', ['select', 'dispatch']);
    store.select.and.returnValue(of(studyState));

    TestBed.configureTestingModule({
      declarations: [StudyPageComponent, KanjiSvgDrawingPreviewComponent],
      imports: [CommonModule, DragDropModule],
      providers: [{ provide: Store, useValue: store }]
    });

    fixture = TestBed.createComponent(StudyPageComponent);
    component = fixture.componentInstance;
  });

  it('creates and populates its fields from the setStudy slice', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.currentKanji.kanji).toBe('一');
    expect(component.currentAllReadings).toEqual(studyState.currentRandomReadings);
    expect(component.length).toBe(3);
    expect(component.currentIndex).toBe(0);
    expect(component.answers).toEqual([]);
  });

  it('dispatches nextKanji with the current answer when clicking Next', () => {
    component.selectedKunyomiReadings = ['いち'];
    component.selectedOnyomiReadings = ['イチ'];

    component.onNextClicked();

    expect(store.dispatch).toHaveBeenCalledWith(
      nextKanji({ answer: new Answer(new Kanji('一', ['いち', 'ひと'], ['イチ']), ['いち'], ['イチ']) })
    );
    expect(component.selectedKunyomiReadings).toEqual([]);
    expect(component.selectedOnyomiReadings).toEqual([]);
  });

  it('does not dispatch once every kanji has been answered', () => {
    component.answers = [
      new Answer(component.currentKanji),
      new Answer(component.currentKanji),
      new Answer(component.currentKanji)
    ];

    component.onNextClicked();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
