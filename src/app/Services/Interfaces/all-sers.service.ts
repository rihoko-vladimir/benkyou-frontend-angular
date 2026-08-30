import { Observable } from 'rxjs';
import { IPagedSets } from './paged-sets';

export interface IAllSetsService {
  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): Observable<IPagedSets>;
}
