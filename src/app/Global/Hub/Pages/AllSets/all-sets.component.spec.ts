import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import Set from '../../../../Models/Set';
import { ISetsState, allSetsInitialState } from '../../../../Redux/Reducers/all-sets.reducer';
import { AllSetsService } from '../../../../Services/all-sets.service';
import { MySetsService } from '../../../../Services/my-sets.service';
import { loadAllSetsFailure, loadAllSetsSuccess } from '../../../../Redux/Actions/all-sets.actions';
import { AllSetsComponent } from './all-sets.component';

describe('AllSetsComponent', () => {
  let component: AllSetsComponent;
  let fixture: ComponentFixture<AllSetsComponent>;
  let store: { select: () => BehaviorSubject<ISetsState>; dispatch: ReturnType<typeof vi.fn> };
  let allSetsService: { getAllSets: ReturnType<typeof vi.fn> };
  let allSetsState$: BehaviorSubject<ISetsState>;

  const buildSet = (id: string) => new Set(id, `Set ${id}`, 'desc', 'author', 'author-id');

  beforeEach(() => {
    allSetsState$ = new BehaviorSubject<ISetsState>(allSetsInitialState);
    store = { select: () => allSetsState$, dispatch: vi.fn() };

    allSetsService = {
      getAllSets: vi.fn().mockReturnValue(of({ sets: [buildSet('1')], pagesCount: 3, currentPage: 1 }))
    };

    TestBed.configureTestingModule({
      imports: [AllSetsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: AllSetsService, useValue: allSetsService },
        // Rendered by the real SetGridComponent -> SetComponent chain.
        { provide: MySetsService, useValue: { addSet: vi.fn() } }
      ]
    });

    fixture = TestBed.createComponent(AllSetsComponent);
    component = fixture.componentInstance;
  });

  it('loads all sets on init and clears the spinner', () => {
    fixture.detectChanges();

    expect(allSetsService.getAllSets).toHaveBeenCalledWith(1, allSetsInitialState.setsCount, undefined);
    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(false);
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
  });

  it('shows the spinner while a search is in flight and clears it once the slice settles', () => {
    fixture.detectChanges();
    component.searchControl.setValue('kanji');
    component.onSearchTyped();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();

    allSetsState$.next({ ...allSetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
  });

  it('dispatches loadAllSetsSuccess on successful load', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      loadAllSetsSuccess({ sets: [buildSet('1')], pagesCount: 3, pageNumber: 1 })
    );
  });

  it('dispatches loadAllSetsFailure when the initial load errors', () => {
    allSetsService.getAllSets.mockReturnValue(throwError(() => ({ error: 'boom' })));
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(loadAllSetsFailure({ errorMessage: 'boom' }));
  });

  it('reflects an error state from the store slice and retries from the error component', () => {
    allSetsState$.next({ ...allSetsInitialState, errorMessage: 'failed' });
    fixture.detectChanges();

    expect(component.isError()).toBe(true);
    allSetsService.getAllSets.mockClear();

    fixture.debugElement.query(By.css('app-error')).nativeElement.querySelector('button').click();

    expect(allSetsService.getAllSets).toHaveBeenCalledWith(1, allSetsInitialState.setsCount, '');
  });

  it('exposes current sets, counts and page from the store slice', () => {
    allSetsState$.next({ ...allSetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();

    expect(component.currentSets()).toEqual([buildSet('1')]);
    expect(component.setCount()).toBe(allSetsInitialState.setsCount);
    expect(component.pagesCount()).toBe(3);
    expect(component.currentPage()).toBe(0);

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-set')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeTruthy();
  });

  it('renders the empty message when the slice holds no sets', () => {
    allSetsState$.next({ ...allSetsInitialState, sets: [], pagesCount: 1 });
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Whooaaa, so empty here...');
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeFalsy();
  });

  it('searches with the current search control value', () => {
    fixture.detectChanges();
    allSetsService.getAllSets.mockClear();
    component.searchControl.setValue('kanji');

    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('change', { bubbles: true }));

    // Simulate the store round trip: the action dispatched on success lands
    // back in the slice, which re-runs the effect that clears the spinner.
    allSetsState$.next({ ...allSetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(allSetsService.getAllSets).toHaveBeenCalledWith(1, allSetsInitialState.setsCount, 'kanji');
  });

  it('retries the load using the current page and search value', () => {
    fixture.detectChanges();
    allSetsService.getAllSets.mockClear();
    component.searchControl.setValue('retry-query');

    component.onRetryClicked();

    expect(allSetsService.getAllSets).toHaveBeenCalledWith(1, allSetsInitialState.setsCount, 'retry-query');
  });

  it('loads the requested page on page change', () => {
    allSetsState$.next({ ...allSetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();
    fixture.detectChanges();
    allSetsService.getAllSets.mockClear();
    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).injector.get(MatPaginator);

    paginator.page.emit({ pageIndex: 1 } as PageEvent);

    expect(allSetsService.getAllSets).toHaveBeenCalledWith(2, allSetsInitialState.setsCount, '');
  });
});
