import { Injectable } from '@angular/core';
import { IMySetsService } from './Interfaces/my-sets.service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import Set from '../Models/Set';
import { SetResponse } from '../Models/Responses/SetResponse';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { Observable } from 'rxjs';
import { SetRequest } from '../Models/Requests/SetRequest';
import * as jsonpatch from 'fast-json-patch';
import { map } from 'rxjs';
import {
  mapKanjiToKanjiRequest,
  mapPagedSetsResponseToPagedSets,
  mapSetResponseToSet,
  mapSetToSetRequest
} from './Helpers/converters';
import { IPagedSets } from './Interfaces/paged-sets';

@Injectable()
export class MySetsService implements IMySetsService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration
  ) {}

  createSet(set: Set): Observable<Set> {
    return this.httpClient
      .post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, this.toSetRequest(set), {
        withCredentials: true
      })
      .pipe(map(mapSetResponseToSet));
  }

  addSet(set: Set): Observable<Set> {
    return this.httpClient
      .post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, this.toSetRequest(set), {
        withCredentials: true
      })
      .pipe(map(mapSetResponseToSet));
  }

  getMySets(pageNumber: number, pageSize: number): Observable<IPagedSets> {
    return this.httpClient
      .get<PagedSetsResponse>(
        `${this.appConfig.apiEndpoint}/sets/my-sets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          withCredentials: true
        }
      )
      .pipe(map(mapPagedSetsResponseToPagedSets));
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

  private toSetRequest(set: Set): SetRequest {
    return {
      name: set.name,
      description: set.description,
      kanjiList: set.kanjiList.map(mapKanjiToKanjiRequest)
    };
  }
}
