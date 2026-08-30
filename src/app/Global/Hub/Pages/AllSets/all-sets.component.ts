import { Component, OnDestroy, OnInit } from '@angular/core';
import Set from '../../../../Models/Set';
import { Store } from '@ngrx/store';
import AppState from '../../../../Redux/app.state';
import { selectAllSets } from '../../../../Redux/Selectors/selectors';
import { AllSetsService } from '../../../../Services/all-sets.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ErrorComponent } from '../../Components/ErrorComponent/error.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SetGridComponent } from '../../Components/SetGrid/set-grid.component';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { loadAllSetsFailure, loadAllSetsSuccess } from '../../../../Redux/Actions/all-sets.actions';

@Component({
  selector: 'all-sets-page',
  templateUrl: 'all-sets.component.html',
  styleUrls: ['all-sets.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    SetGridComponent,
    MatProgressSpinner,
    ErrorComponent,
    MatPaginator
  ]
})
export class AllSetsComponent implements OnDestroy, OnInit {
  currentSets: Set[] = [];
  setCount: number = 9;
  pagesCount: number = 1;
  currentPage: number = 0;
  pageSize: number = 9;
  subscription;
  isLoading: boolean = true;
  isError: boolean = false;
  searchControl: FormControl = new FormControl('');

  constructor(
    private store: Store<AppState>,
    private allSetsService: AllSetsService
  ) {
    this.subscription = store.select(selectAllSets).subscribe(value => {
      this.currentSets = value.sets;
      this.setCount = value.setsCount;
      this.currentPage = value.currentPage - 1;
      this.pagesCount = value.pagesCount;
      this.pageSize = value.setsCount;
      this.isLoading = false;
      this.isError = value.errorMessage !== undefined;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadAllSets(1, this.setCount);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  onSearchTyped() {
    this.isLoading = true;
    this.loadAllSets(this.currentPage + 1, this.setCount, this.searchControl.value);
  }

  onRetryClicked() {
    this.isLoading = true;
    this.loadAllSets(this.currentPage + 1, this.setCount, this.searchControl.value);
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.loadAllSets(event.pageIndex + 1, this.setCount, this.searchControl.value);
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
