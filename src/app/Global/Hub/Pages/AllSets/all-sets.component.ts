import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAllSets } from '../../../../Redux/Selectors/selectors';
import { allSetsInitialState } from '../../../../Redux/Reducers/all-sets.reducer';
import { AllSetsService } from '../../../../Services/all-sets.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SetGridComponent } from '../../Components/SetGrid/set-grid.component';

import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { loadAllSetsFailure, loadAllSetsSuccess } from '../../../../Redux/Actions/all-sets.actions';

@Component({
  selector: 'app-all-sets-page',
  templateUrl: 'all-sets.component.html',
  styleUrls: ['all-sets.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    SetGridComponent,
    MatProgressSpinner,
    ErrorComponent,
    MatPaginator
  ]
})
export class AllSetsComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);
  private allSetsService = inject(AllSetsService);

  // Zoneless prep (commit A): the store slice is the single source of
  // truth; template reads go through signals so zoneless schedules CD.
  private allSetsState = toSignal(this.store.select(selectAllSets), {
    initialValue: allSetsInitialState
  });
  isLoading = signal(true);
  isError = computed(() => this.allSetsState().errorMessage !== undefined);
  currentSets = computed(() => this.allSetsState().sets);
  setCount = computed(() => this.allSetsState().setsCount);
  pagesCount = computed(() => this.allSetsState().pagesCount);
  currentPage = computed(() => this.allSetsState().currentPage - 1);
  // Note: preserved verbatim from the pre-migration behavior — the old code
  // assigned `pageSize = value.setsCount` (matches [length] math below).
  pageSize = computed(() => this.allSetsState().setsCount);
  searchControl: FormControl = new FormControl('');

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadAllSets(1, this.setCount());
  }

  onSearchTyped() {
    this.isLoading.set(true);
    this.loadAllSets(this.currentPage() + 1, this.setCount(), this.searchControl.value);
  }

  onRetryClicked() {
    this.isLoading.set(true);
    this.loadAllSets(this.currentPage() + 1, this.setCount(), this.searchControl.value);
  }

  onPageChanged(event: PageEvent) {
    this.isLoading.set(true);
    this.loadAllSets(event.pageIndex + 1, this.setCount(), this.searchControl.value);
  }

  private loadAllSets(pageNumber: number, pageSize: number, searchQuery?: string) {
    this.allSetsService.getAllSets(pageNumber, pageSize, searchQuery).subscribe({
      next: response =>
        this.store.dispatch(
          loadAllSetsSuccess({
            sets: response.sets,
            pagesCount: response.pagesCount,
            pageNumber: response.currentPage
          })
        ),
      error: error => this.store.dispatch(loadAllSetsFailure({ errorMessage: error.error }))
    });
  }
}
