import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import Set from '../../../../Models/Set';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogProperties, OpenMode, SetDialogComponent } from '../../Components/SetDialog/set-dialog.component';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectMySets } from '../../../../Redux/Selectors/selectors';
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
  selector: 'my-sets-page',
  templateUrl: 'my-sets.component.html',
  styleUrls: ['my-sets.component.scss'],
  imports: [MatButton, SetGridComponent, MatProgressSpinner, ErrorComponent, MatPaginator, MatDialogModule]
})
export class MySetsComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private store = inject<Store<AppState>>(Store);
  private mySetsService = inject(MySetsService);

  sets: Set[] = [];
  currentPage: number = 0;
  pageSize: number = 9;
  pagesCount: number = 1;
  subscription;
  isLoading: boolean = false;
  isError: boolean = false;

  constructor() {
    const store = this.store;

    this.subscription = store.select(selectMySets).subscribe(value => {
      this.pagesCount = value.pagesCount;
      this.pageSize = value.setsCount;
      this.sets = value.sets;
      this.isLoading = false;
      this.isError = value.errorMessage !== undefined;
      this.currentPage = value.currentPage - 1;
    });
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
    this.isLoading = true;
    this.loadMySets(1, this.pageSize);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSetRemoved(id: string) {
    this.mySetsService.removeMySet(id).subscribe({
      next: () => {
        this.store.dispatch(removeSetSuccess());
        this.loadMySets(this.currentPage + 1, this.pageSize);
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
    this.isLoading = true;
    this.loadMySets(1, this.pageSize);
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.loadMySets(event.pageIndex + 1, this.pageSize);
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
