import { Injectable } from '@angular/core';
import { IMySetsService } from './Interfaces/my-sets.service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { Action, Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import Set from '../Models/Set';
import { SetResponse } from '../Models/Responses/SetResponse';
import { catchError, EMPTY } from 'rxjs';
import { loadMySetsFailure, loadMySetsSuccess } from '../Redux/Actions/my-sets.actions';
import * as jsonpatch from 'fast-json-patch';
import { loadAllSetsFailure } from '../Redux/Actions/all-sets.actions';
import { mapSetToSetRequest } from './Helpers/converters';
import { addSetSuccess, createSetSuccess, removeSetSuccess } from '../Redux/Actions/snackbar.actions';
import { SetsApiService } from './sets-api.service';

@Injectable()
export class MySetsService implements IMySetsService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration,
    private store: Store<AppState>,
    private setsApi: SetsApiService
  ) {}

  createSet(set: Set): void {
    this.submitSet(set, createSetSuccess, () => this.getMySets(1, 9));
  }

  addSet(set: Set): void {
    this.submitSet(set, addSetSuccess);
  }

  private submitSet(set: Set, successAction: () => Action, afterSuccess?: () => void): void {
    this.setsApi
      .createSet(set)
      .pipe(
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.store.dispatch(successAction());
        afterSuccess?.();
      });
  }

  getMySets(pageNumber: number, pageSize: number): void {
    this.setsApi
      .getMySets(pageNumber, pageSize)
      .pipe(
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(value => {
        this.store.dispatch(
          loadMySetsSuccess({
            sets: value.sets,
            pagesCount: value.pagesCount,
            pageNumber: value.currentPage
          })
        );
      });
  }

  patchMySet(setId: string, newSet: Set, originalSet: Set): void {
    const sourceSet = mapSetToSetRequest({ ...originalSet });
    const observer = jsonpatch.observe<Set>(sourceSet);
    Object.assign(sourceSet, mapSetToSetRequest(newSet));
    const request = jsonpatch.generate(observer);
    this.httpClient
      .patch<SetResponse>(`${this.appConfig.apiEndpoint}/sets/modify?setId=${setId}`, request, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          this.store.dispatch(loadAllSetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.getMySets(1, 9);
      });
  }

  removeMySet(setId: string, pageNumber: number, pageSize: number): void {
    this.httpClient
      .delete<void>(`${this.appConfig.apiEndpoint}/sets/remove?setId=${setId}`, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.store.dispatch(removeSetSuccess());
        this.getMySets(pageNumber, pageSize);
      });
  }
}
