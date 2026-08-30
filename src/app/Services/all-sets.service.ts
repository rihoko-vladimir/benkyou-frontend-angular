import { Injectable } from '@angular/core';
import { IAllSetsService } from './Interfaces/all-sers.service';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { mapPagedSetsResponseToPagedSets } from './Helpers/converters';
import { IPagedSets } from './Interfaces/paged-sets';

@Injectable()
export class AllSetsService implements IAllSetsService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration
  ) {}

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
}
