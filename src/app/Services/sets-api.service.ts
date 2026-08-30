import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import Set from '../Models/Set';
import { SetResponse } from '../Models/Responses/SetResponse';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { Observable, map } from 'rxjs';
import { IPagedSets } from './Interfaces/paged-sets';
import { mapPagedSetsResponseToPagedSets, mapSetResponseToSet, mapSetToSetRequest } from './Helpers/converters';

@Injectable()
/**
 * Shared HTTP gateway for set endpoints.
 *
 * Thin layer: builds the request, maps the raw API response to domain types
 * (via converters.ts) and returns an Observable. Error handling and store
 * dispatch stay in the consumer facades (MySetsService / AllSetsService).
 *
 * Note: searchQuery is URL-encoded on purpose so queries containing special
 * characters (spaces, '&', '=') reach the backend intact instead of breaking
 * the query string.
 */
export class SetsApiService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration
  ) {}

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

  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): Observable<IPagedSets> {
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
