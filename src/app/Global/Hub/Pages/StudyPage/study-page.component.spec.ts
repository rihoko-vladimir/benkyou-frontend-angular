import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import Answer from '../../../../Models/Answer';
import Kanji from '../../../../Models/Kanji';
import { nextKanji } from '../../../../Redux/Actions/set-study.actions';
import { IStudyState } from '../../../../Redux/Reducers/set-study.reducer';
import { KanjiSvgDrawingPreviewComponent } from '../../Components/KanjiSvgDrawingPreview/kanji-svg-drawing-preview.component';
import { StudyPageComponent } from './study-page.component';

// The real KanjiSvgDrawingPreviewComponent fetches `assets/kanji/*.svg` in its
// ngOnInit, which would perform a real HTTP request in the test environment.
// It is stubbed out here: this smoke spec only cares about the StudyPage
// component's store wiring, not about SVG rendering.
@Component({
  selector: 'app-kanji-svg-drawing-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
class KanjiSvgDrawingPreviewStubComponent {
  // v22 throws NG0303 on unknown property bindings, so the stub must
  // mirror the real component's input surface.
  @Input() kanji = '本';
  @Input() width = '150px';
  @Input() height = '150px';
}

describe('StudyPageComponent', () => {
  let component: StudyPageComponent;
  let fixture: ComponentFixture<StudyPageComponent>;
  let store: { select: () => BehaviorSubject<IStudyState>; dispatch: ReturnType<typeof vi.fn> };
  let studyState: IStudyState;
  let studyState$: BehaviorSubject<IStudyState>;

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
    studyState$ = new BehaviorSubject<IStudyState>(studyState);

    store = { select: () => studyState$, dispatch: vi.fn() };

    TestBed.configureTestingModule({
      // StudyPageComponent is standalone (post-migration): it goes in `imports`
      // of the test module, not `declarations`.
      imports: [StudyPageComponent],
      providers: [{ provide: Store, useValue: store }]
    })
      // The component's own `imports` array pulls in the real
      // KanjiSvgDrawingPreviewComponent, whose ngOnInit fetches
      // `assets/kanji/*.svg` - a real HTTP request inside a unit test. Swap it
      // for an inert stub; this smoke spec only cares about store wiring.
      .overrideComponent(StudyPageComponent, {
        remove: { imports: [KanjiSvgDrawingPreviewComponent] },
        add: { imports: [KanjiSvgDrawingPreviewStubComponent] }
      });

    fixture = TestBed.createComponent(StudyPageComponent);
    component = fixture.componentInstance;
  });

  it('creates and populates its fields from the setStudy slice', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.currentKanji().kanji).toBe('一');
    expect(component.currentAllReadings()).toEqual(studyState.currentRandomReadings);
    expect(component.length()).toBe(3);
    expect(component.currentIndex()).toBe(0);
    expect(component.answers()).toEqual([]);
  });

  it('dispatches nextKanji with the current answer when clicking Next', () => {
    component.selectedKunyomiReadings.set(['いち']);
    component.selectedOnyomiReadings.set(['イチ']);

    component.onNextClicked();

    expect(store.dispatch).toHaveBeenCalledWith(
      nextKanji({ answer: new Answer(new Kanji('一', ['いち', 'ひと'], ['イチ']), ['いち'], ['イチ']) })
    );
    expect(component.selectedKunyomiReadings()).toEqual([]);
    expect(component.selectedOnyomiReadings()).toEqual([]);
  });

  it('does not dispatch once every kanji has been answered', () => {
    studyState$.next({
      ...studyState,
      answerList: [
        new Answer(studyState.currentKanji),
        new Answer(studyState.currentKanji),
        new Answer(studyState.currentKanji)
      ]
    });

    component.onNextClicked();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
