import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import Set from '../Models/Set';
import { SetResponse } from '../Models/Responses/SetResponse';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { Observable, map } from 'rxjs';
import { PagedSets } from './Interfaces/paged-sets';
import { mapPagedSetsResponseToPagedSets, mapSetResponseToSet, mapSetToSetRequest } from './Helpers/converters';

@Injectable()
export class SetsApiService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration
  ) {}

  getMySets(pageNumber: number, pageSize: number): Observable<PagedSets> {
    return this.httpClient
      .get<PagedSetsResponse>(
        `${this.appConfig.apiEndpoint}/sets/my-sets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          withCredentials: true
        }
      )
      .pipe(map(mapPagedSetsResponseToPagedSets));
  }

  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): Observable<PagedSets> {
    return this.httpClient
      .get<PagedSetsResponse>(
        `${this.appConfig.apiEndpoint}/sets/all-sets?pageNumber=${pageNumber}&pageSize=${pageSize}&searchQuery=${encodeURIComponent(searchQuery ?? '')}`,
        {
          withCredentials: true
        }
      )
      .pipe(map(mapPagedSetsResponseToPagedSets));
  }

  createSet(set: Set): Observable<Set> {
    return this.httpClient
      .post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, mapSetToSetRequest(set), {
        withCredentials: true
      })
      .pipe(map(mapSetResponseToSet));
  }
}
