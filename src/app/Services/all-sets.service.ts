import { Injectable, inject } from '@angular/core';
import { IAllSetsService } from './Interfaces/all-sers.service';
import { Observable } from 'rxjs';
import { SetsApiService } from './sets-api.service';
import { IPagedSets } from './Interfaces/paged-sets';

/**
 * Facade over the shared SetsApiService for the all-sets slice.
 * HTTP request building and response mapping live in SetsApiService;
 * this service exposes the typed contracts the components subscribe to.
 */
@Injectable()
export class AllSetsService implements IAllSetsService {
  private setsApi = inject(SetsApiService);


  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): Observable<IPagedSets> {
    return this.setsApi.getAllSets(pageNumber, pageSize, searchQuery);
  }
}
