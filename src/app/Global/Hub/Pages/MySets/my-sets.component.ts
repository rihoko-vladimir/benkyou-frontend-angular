import { Component, OnInit, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import Set from '../../../../Models/Set';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogProperties, OpenMode, SetDialogComponent } from '../../Components/SetDialog/set-dialog.component';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectMySets } from '../../../../Redux/Selectors/selectors';
import { mySetsInitialState } from '../../../../Redux/Reducers/my-sets.reducer';
import { MySetsService } from '../../../../Services/my-sets.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SetGridComponent } from '../../Components/SetGrid/set-grid.component';

import { MatButton } from '@angular/material/button';
import { loadMySetsFailure, loadMySetsSuccess } from '../../../../Redux/Actions/my-sets.actions';
import { createSetSuccess, removeSetSuccess } from '../../../../Redux/Actions/snackbar.actions';
import { loadAllSetsFailure } from '../../../../Redux/Actions/all-sets.actions';

@Component({
  selector: 'app-my-sets-page',
  templateUrl: 'my-sets.component.html',
  styleUrls: ['my-sets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, SetGridComponent, MatProgressSpinner, ErrorComponent, MatPaginator, MatDialogModule]
})
export class MySetsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private store = inject<Store<AppState>>(Store);
  private mySetsService = inject(MySetsService);

  // Zoneless prep (commit A): store slice via toSignal; template reads
  // through signals so zoneless schedules CD.
  private mySetsState = toSignal(this.store.select(selectMySets), { initialValue: mySetsInitialState });
  isLoading = signal(false);
  isError = computed(() => this.mySetsState().errorMessage !== undefined);
  // Writable signal: the set-grid two-way binding pushes local reorders
  // back into it; the effect below keeps it in sync with the store slice.
  sets = signal<Set[]>([]);
  pagesCount = computed(() => this.mySetsState().pagesCount);
  // Preserved from pre-migration behavior: pageSize tracks setsCount.
  pageSize = computed(() => this.mySetsState().setsCount);
  currentPage = computed(() => this.mySetsState().currentPage - 1);

  constructor() {
    effect(() => this.sets.set(this.mySetsState().sets));
  }

  onSetsChanged(changedSets: Set[]) {
    this.sets.set(changedSets);
  }

  onCreateNewSetClicked() {
    this.dialog
      .open(SetDialogComponent, {
        data: new DialogProperties(OpenMode.create, new Set())
      })
      .afterClosed()
      .subscribe(set => this.onSetCreated(set));
  }

  onSetCreated(set: Set | undefined) {
    if (set === undefined) return;

    this.mySetsService.createSet(set).subscribe({
      next: () => {
        this.store.dispatch(createSetSuccess());
        this.loadMySets(1, 9);
      },
      error: error => this.store.dispatch(loadMySetsFailure({ errorMessage: error.error }))
    });
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadMySets(1, this.pageSize());
  }

  onSetRemoved(id: string) {
    this.mySetsService.removeMySet(id).subscribe({
      next: () => {
        this.store.dispatch(removeSetSuccess());
        this.loadMySets(this.currentPage() + 1, this.pageSize());
      },
      error: error => this.store.dispatch(loadMySetsFailure({ errorMessage: error.error }))
    });
  }

  onSetChanged(changesObj: { set: Set; originalSet: Set }) {
    this.mySetsService.patchMySet(changesObj.set.id, changesObj.set, changesObj.originalSet).subscribe({
      next: () => this.loadMySets(1, 9),
      error: error => this.store.dispatch(loadAllSetsFailure({ errorMessage: error.error }))
    });
  }

  onRetryClicked() {
    this.isLoading.set(true);
    this.loadMySets(1, this.pageSize());
  }

  onPageChanged(event: PageEvent) {
    this.isLoading.set(true);
    this.loadMySets(event.pageIndex + 1, this.pageSize());
  }

  private loadMySets(pageNumber: number, pageSize: number) {
    this.mySetsService.getMySets(pageNumber, pageSize).subscribe({
      next: value =>
        this.store.dispatch(
          loadMySetsSuccess({
            sets: value.sets,
            pagesCount: value.pagesCount,
            pageNumber: value.currentPage
          })
        ),
      error: error => this.store.dispatch(loadMySetsFailure({ errorMessage: error.error }))
    });
  }
}
