import { Injectable } from '@angular/core';
import { IAllSetsService } from './Interfaces/all-sers.service';
import { catchError, EMPTY } from 'rxjs';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { loadAllSetsFailure, loadAllSetsSuccess } from '../Redux/Actions/all-sets.actions';
import { SetsApiService } from './sets-api.service';

@Injectable()
export class AllSetsService implements IAllSetsService {
  constructor(
    private store: Store<AppState>,
    private setsApi: SetsApiService
  ) {}

  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): void {
    this.setsApi
      .getAllSets(pageNumber, pageSize, searchQuery)
      .pipe(
        catchError(error => {
          this.store.dispatch(loadAllSetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(response => {
        this.store.dispatch(
          loadAllSetsSuccess({
            sets: response.sets,
            pagesCount: response.pagesCount,
            pageNumber: response.currentPage
          })
        );
      });
  }
}
