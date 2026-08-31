import { Injectable, inject } from '@angular/core';
import { IMySetsService } from './Interfaces/my-sets.service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import Set from '../Models/Set';
import { SetRequest } from '../Models/Requests/SetRequest';
import { Observable } from 'rxjs';
import * as jsonpatch from 'fast-json-patch';
import { mapSetToSetRequest } from './Helpers/converters';
import { SetsApiService } from './sets-api.service';
import { IPagedSets } from './Interfaces/paged-sets';

/**
 * Facade over the shared SetsApiService for the my-sets slice.
 * HTTP request building and response mapping live in SetsApiService;
 * this service exposes the typed contracts the components subscribe to.
 */
@Injectable()
export class MySetsService implements IMySetsService {
  private httpClient = inject(HttpClient);
  private appConfig = inject(AppConfiguration);
  private setsApi = inject(SetsApiService);

  createSet(set: Set): Observable<Set> {
    return this.setsApi.createSet(set);
  }

  addSet(set: Set): Observable<Set> {
    return this.setsApi.createSet(set);
  }

  getMySets(pageNumber: number, pageSize: number): Observable<IPagedSets> {
    return this.setsApi.getMySets(pageNumber, pageSize);
  }

  patchMySet(setId: string, newSet: Set, originalSet: Set): Observable<void> {
    const sourceSet = mapSetToSetRequest({ ...originalSet });
    const observer = jsonpatch.observe<SetRequest>(sourceSet);
    Object.assign(sourceSet, mapSetToSetRequest(newSet));
    const request = jsonpatch.generate(observer);
    return this.httpClient.patch<void>(`${this.appConfig.apiEndpoint}/sets/modify?setId=${setId}`, request, {
      withCredentials: true
    });
  }

  removeMySet(setId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.appConfig.apiEndpoint}/sets/remove?setId=${setId}`, {
      withCredentials: true
    });
  }
}
