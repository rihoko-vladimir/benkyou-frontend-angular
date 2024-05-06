import { Injectable } from '@angular/core';
import { IMySetsService } from './Interfaces/my-sets.service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import Set from '../Models/Set';
import { SetResponse } from '../Models/Responses/SetResponse';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { catchError, EMPTY, map } from 'rxjs';
import { loadMySetsFailure, loadMySetsSuccess } from '../Redux/Actions/my-sets.actions';
import { SetRequest } from '../Models/Requests/SetRequest';
import * as jsonpatch from 'fast-json-patch';
import { loadAllSetsFailure } from '../Redux/Actions/all-sets.actions';
import { mapKanjiToKanjiRequest, mapSetResponseToSet, mapSetToSetRequest } from './Helpers/converters';
import { addSetSuccess, createSetSuccess, removeSetSuccess } from '../Redux/Actions/snackbar.actions';

@Injectable()
export class MySetsService implements IMySetsService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration,
    private store: Store<AppState>
  ) {}

  createSet(set: Set): void {
    const request: SetRequest = {
      name: set.name,
      description: set.description,
      kanjiList: set.kanjiList.map(mapKanjiToKanjiRequest)
    };
    this.httpClient
      .post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, request, {
        withCredentials: true
      })
      .pipe(
        map(mapSetResponseToSet),
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.store.dispatch(createSetSuccess());
        this.getMySets(1, 9);
      });
  }

  addSet(set: Set): void {
    const request: SetRequest = {
      name: set.name,
      description: set.description,
      kanjiList: set.kanjiList.map(mapKanjiToKanjiRequest)
    };
    this.httpClient
      .post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, request, {
        withCredentials: true
      })
      .pipe(
        map(mapSetResponseToSet),
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.store.dispatch(addSetSuccess());
      });
  }

  getMySets(pageNumber: number, pageSize: number): void {
    this.httpClient
      .get<PagedSetsResponse>(
        `${this.appConfig.apiEndpoint}/sets/my-sets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          withCredentials: true
        }
      )
      .pipe(
        map(pagedResponse => ({
          sets: pagedResponse.sets.map(mapSetResponseToSet),
          pagesCount: pagedResponse.pagesCount,
          currentPage: pagedResponse.currentPage
        })),
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
