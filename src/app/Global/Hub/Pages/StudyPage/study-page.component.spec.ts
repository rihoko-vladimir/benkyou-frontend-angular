import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import Answer from '../../../../Models/Answer';
import Kanji from '../../../../Models/Kanji';
import { nextKanji } from '../../../../Redux/Actions/set-study.actions';
import { IStudyState } from '../../../../Redux/Reducers/set-study.reducer';
import { StudyPageComponent } from './study-page.component';

describe('StudyPageComponent', () => {
  let component: StudyPageComponent;
  let fixture: ComponentFixture<StudyPageComponent>;
  let store: { select: () => BehaviorSubject<IStudyState>; dispatch: ReturnType<typeof vi.fn> };
  let studyState: IStudyState;
  let studyState$: BehaviorSubject<IStudyState>;

  const buildAnswer = () => new Answer(studyState.currentKanji, ['いち'], ['イチ']);

  beforeEach(() => {
    // The real KanjiSvgDrawingPreviewComponent fetches `assets/kanji/*.svg` in
    // its ngOnInit; happy-dom's real fetch would leak a NetworkError.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ text: () => Promise.resolve('<svg></svg>') }));

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
      providers: [{ provide: Store, useValue: store }, provideRouter([])]
    });

    fixture = TestBed.createComponent(StudyPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
    fixture.detectChanges();
    component.selectedKunyomiReadings.set(['いち']);
    component.selectedOnyomiReadings.set(['イチ']);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(store.dispatch).toHaveBeenCalledWith(
      nextKanji({ answer: new Answer(new Kanji('一', ['いち', 'ひと'], ['イチ']), ['いち'], ['イチ']) })
    );
    expect(component.selectedKunyomiReadings()).toEqual([]);
    expect(component.selectedOnyomiReadings()).toEqual([]);
  });

  it('does not dispatch once every kanji has been answered', () => {
    studyState$.next({
      ...studyState,
      answerList: [buildAnswer(), buildAnswer(), buildAnswer()]
    });

    component.onNextClicked();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('renders the selected readings inside the kunyomi and onyomi drop lists', () => {
    fixture.detectChanges();
    component.selectedKunyomiReadings.set(['いち']);
    component.selectedOnyomiReadings.set(['イチ']);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('いち');
    expect(fixture.nativeElement.textContent).toContain('イチ');
  });

  it('reorders the candidate readings when dropped within the same list', () => {
    fixture.detectChanges();
    component.currentAllReadings.set(['いち', 'に', 'さん']);
    fixture.detectChanges();
    // Drop lists render in template order: kunyomi, onyomi, candidates.
    const candidates = fixture.debugElement.queryAll(By.directive(CdkDropList))[2].injector.get(CdkDropList);

    candidates.dropped.emit({
      previousContainer: candidates,
      container: candidates,
      previousIndex: 0,
      currentIndex: 2
    } as unknown as CdkDragDrop<string[]>);

    expect(component.currentAllReadings()).toEqual(['さん', 'いち', 'に']);
  });

  it('transfers a reading into the target list when dropped across lists', () => {
    fixture.detectChanges();
    const [kunyomi, onyomi, candidates] = fixture.debugElement
      .queryAll(By.directive(CdkDropList))
      .map(debugElement => debugElement.injector.get(CdkDropList));

    kunyomi.dropped.emit({
      previousContainer: candidates,
      container: kunyomi,
      previousIndex: 0,
      currentIndex: 0
    } as unknown as CdkDragDrop<string[]>);
    // Re-bind cdkDropListData so the lists track the copies drop() wrote
    // back into the signals (as a real drop's change-detection cycle would).
    fixture.detectChanges();
    onyomi.dropped.emit({
      previousContainer: candidates,
      container: onyomi,
      previousIndex: 0,
      currentIndex: 0
    } as unknown as CdkDragDrop<string[]>);

    expect(component.selectedKunyomiReadings()).toEqual(['イチ']);
    expect(component.selectedOnyomiReadings()).toEqual(['に']);
    expect(component.currentAllReadings()).toEqual(['いち', 'ニ', 'ひと', 'サン']);
  });

  it('renders the results component once every kanji has been answered', () => {
    studyState$.next({
      ...studyState,
      answerList: [buildAnswer(), buildAnswer(), buildAnswer()]
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-results')).toBeTruthy();
  });
});
