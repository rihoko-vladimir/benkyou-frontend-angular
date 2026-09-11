import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import Set from '../../../../Models/Set';
import { ISetsState } from '../../../../Redux/Reducers/all-sets.reducer';
import { mySetsInitialState } from '../../../../Redux/Reducers/my-sets.reducer';
import { MySetsService } from '../../../../Services/my-sets.service';
import { loadMySetsFailure, loadMySetsSuccess } from '../../../../Redux/Actions/my-sets.actions';
import { createSetSuccess, removeSetSuccess } from '../../../../Redux/Actions/snackbar.actions';
import { loadAllSetsFailure } from '../../../../Redux/Actions/all-sets.actions';
import { OpenMode, SetDialogComponent } from '../../Components/SetDialog/set-dialog.component';
import { SetGridComponent } from '../../Components/SetGrid/set-grid.component';
import { MySetsComponent } from './my-sets.component';

describe('MySetsComponent', () => {
  let component: MySetsComponent;
  let fixture: ComponentFixture<MySetsComponent>;
  let store: { select: () => BehaviorSubject<ISetsState>; dispatch: ReturnType<typeof vi.fn> };
  let mySetsService: {
    createSet: ReturnType<typeof vi.fn>;
    getMySets: ReturnType<typeof vi.fn>;
    removeMySet: ReturnType<typeof vi.fn>;
    patchMySet: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let mySetsState$: BehaviorSubject<ISetsState>;
  let afterClosedSubject: { subscribe: ReturnType<typeof vi.fn> };

  const buildSet = (id: string) => new Set(id, `Set ${id}`, 'desc', 'author', 'author-id');

  const getGrid = () =>
    fixture.debugElement.query(By.directive(SetGridComponent)).componentInstance as SetGridComponent;

  beforeEach(() => {
    mySetsState$ = new BehaviorSubject<ISetsState>(mySetsInitialState);
    store = { select: () => mySetsState$, dispatch: vi.fn() };

    mySetsService = {
      createSet: vi.fn(),
      getMySets: vi.fn().mockReturnValue(of({ sets: [buildSet('1')], pagesCount: 2, currentPage: 1 })),
      removeMySet: vi.fn(),
      patchMySet: vi.fn()
    };

    afterClosedSubject = { subscribe: vi.fn() };

    TestBed.configureTestingModule({
      imports: [MySetsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: MySetsService, useValue: mySetsService }
      ]
    });

    fixture = TestBed.createComponent(MySetsComponent);
    component = fixture.componentInstance;

    // MatDialogModule is part of the component's own imports, so its MatDialog
    // provider shadows any TestBed override; patch the instance the component injects.
    const injectedDialog = fixture.debugElement.injector.get(MatDialog);
    dialog = {
      open: vi.spyOn(injectedDialog, 'open').mockReturnValue({
        afterClosed: () => afterClosedSubject
      } as never)
    };
  });

  it('loads my sets on init and clears the spinner once the state settles', () => {
    fixture.detectChanges();

    expect(mySetsService.getMySets).toHaveBeenCalledWith(1, mySetsInitialState.setsCount);
    expect(component.isError()).toBe(false);
    expect(component.sets()).toEqual(mySetsInitialState.sets);
    expect(fixture.nativeElement.querySelector('app-set-grid')).toBeTruthy();
  });

  it('dispatches loadMySetsSuccess on ngOnInit load success', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      loadMySetsSuccess({ sets: [buildSet('1')], pagesCount: 2, pageNumber: 1 })
    );
  });

  it('dispatches loadMySetsFailure when the initial load errors', () => {
    mySetsService.getMySets.mockReturnValue(throwError(() => ({ error: 'boom' })));
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(loadMySetsFailure({ errorMessage: 'boom' }));
  });

  it('reflects the error state when the store slice carries an errorMessage', () => {
    mySetsState$.next({ ...mySetsInitialState, errorMessage: 'failed' });
    fixture.detectChanges();

    expect(component.isError()).toBe(true);
    expect(fixture.nativeElement.querySelector('app-error')).toBeTruthy();
  });

  it('renders the empty message when the slice holds no sets', () => {
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Whooaaa, so empty here...');
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeFalsy();
  });

  it('renders the set grid and paginator from the store slice', () => {
    mySetsState$.next({ ...mySetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-set')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-paginator')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Whooaaa, so empty here...');
  });

  it('shows the spinner on retry and hides it once the slice settles', () => {
    fixture.detectChanges();
    component.onRetryClicked();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-set-grid')).toBeFalsy();

    mySetsState$.next({ ...mySetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
  });

  it('reloads sets on retry', () => {
    fixture.detectChanges();
    mySetsService.getMySets.mockClear();

    component.onRetryClicked();
    // Simulate the store round trip: the success action lands back in the
    // slice, which re-runs the effect that clears the spinner.
    mySetsState$.next({ ...mySetsInitialState, sets: [buildSet('1')], pagesCount: 2, currentPage: 1 });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(mySetsService.getMySets).toHaveBeenCalledWith(1, mySetsInitialState.setsCount);
  });

  it('updates the local sets signal when the grid emits a change', () => {
    fixture.detectChanges();
    const changed = [buildSet('9')];

    getGrid().setsChange.emit(changed);

    expect(component.sets()).toEqual(changed);
  });

  it('opens the create-set dialog and creates the set on close', () => {
    fixture.detectChanges();
    mySetsService.createSet.mockReturnValue(of(undefined));
    let closeCallback: (set: Set | undefined) => void = () => {};
    afterClosedSubject.subscribe.mockImplementation(cb => {
      closeCallback = cb;
    });

    fixture.nativeElement.querySelector('.top-section button').click();
    closeCallback(buildSet('new'));

    expect(dialog.open).toHaveBeenCalledWith(SetDialogComponent, {
      data: expect.objectContaining({ mode: OpenMode.create, set: expect.any(Set) })
    });
    expect(mySetsService.createSet).toHaveBeenCalledWith(buildSet('new'));
    expect(store.dispatch).toHaveBeenCalledWith(createSetSuccess());
  });

  it('does nothing when the create-set dialog is closed without a set', () => {
    fixture.detectChanges();
    let closeCallback: (set: Set | undefined) => void = () => {};
    afterClosedSubject.subscribe.mockImplementation(cb => {
      closeCallback = cb;
    });

    component.onCreateNewSetClicked();
    closeCallback(undefined);

    expect(mySetsService.createSet).not.toHaveBeenCalled();
  });

  it('dispatches loadMySetsFailure when creating a set fails', () => {
    fixture.detectChanges();
    mySetsService.createSet.mockReturnValue(throwError(() => ({ error: 'create failed' })));

    component.onSetCreated(buildSet('x'));

    expect(store.dispatch).toHaveBeenCalledWith(loadMySetsFailure({ errorMessage: 'create failed' }));
  });

  it('removes a set and reloads on success', () => {
    fixture.detectChanges();
    mySetsService.removeMySet.mockReturnValue(of(undefined));
    // Distinct reload payload so the post-remove load is distinguishable from the init load.
    mySetsService.getMySets.mockReturnValueOnce(of({ sets: [buildSet('2')], pagesCount: 5, currentPage: 2 }));

    getGrid().setsRemove.emit('1');

    expect(mySetsService.removeMySet).toHaveBeenCalledWith('1');
    expect(store.dispatch).toHaveBeenCalledWith(removeSetSuccess());
    expect(store.dispatch).toHaveBeenCalledWith(
      loadMySetsSuccess({ sets: [buildSet('2')], pagesCount: 5, pageNumber: 2 })
    );
  });

  it('dispatches loadMySetsFailure when removing a set fails', () => {
    fixture.detectChanges();
    mySetsService.removeMySet.mockReturnValue(throwError(() => ({ error: 'remove failed' })));

    component.onSetRemoved('1');

    expect(store.dispatch).toHaveBeenCalledWith(loadMySetsFailure({ errorMessage: 'remove failed' }));
  });

  it('patches a set and reloads on success', () => {
    fixture.detectChanges();
    mySetsService.patchMySet.mockReturnValue(of(undefined));
    // Distinct reload payload so the post-patch load is distinguishable from the init load.
    mySetsService.getMySets.mockReturnValueOnce(of({ sets: [buildSet('2')], pagesCount: 5, currentPage: 2 }));
    const original = buildSet('1');
    const updated = buildSet('1');
    updated.name = 'Updated';

    getGrid().setChange.emit({ set: updated, originalSet: original });

    expect(mySetsService.patchMySet).toHaveBeenCalledWith('1', updated, original);
    expect(store.dispatch).toHaveBeenCalledWith(
      loadMySetsSuccess({ sets: [buildSet('2')], pagesCount: 5, pageNumber: 2 })
    );
  });

  it('dispatches loadAllSetsFailure when patching a set fails', () => {
    fixture.detectChanges();
    mySetsService.patchMySet.mockReturnValue(throwError(() => ({ error: 'patch failed' })));
    const original = buildSet('1');
    const updated = buildSet('1');

    component.onSetChanged({ set: updated, originalSet: original });

    expect(store.dispatch).toHaveBeenCalledWith(loadAllSetsFailure({ errorMessage: 'patch failed' }));
  });

  it('loads the requested page on page change', () => {
    mySetsState$.next({ ...mySetsInitialState, sets: [buildSet('1')], pagesCount: 3, currentPage: 1 });
    fixture.detectChanges();
    fixture.detectChanges();
    mySetsService.getMySets.mockClear();
    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).injector.get(MatPaginator);

    paginator.page.emit({ pageIndex: 2 } as PageEvent);

    expect(mySetsService.getMySets).toHaveBeenCalledWith(3, mySetsInitialState.setsCount);
  });

  it('retries the load from the error component', () => {
    mySetsState$.next({ ...mySetsInitialState, errorMessage: 'failed' });
    fixture.detectChanges();
    mySetsService.getMySets.mockClear();

    fixture.debugElement.query(By.css('app-error')).nativeElement.querySelector('button').click();

    expect(mySetsService.getMySets).toHaveBeenCalledWith(1, mySetsInitialState.setsCount);
  });
});
