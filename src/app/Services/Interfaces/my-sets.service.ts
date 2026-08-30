import Set from '../../Models/Set';
import { Observable } from 'rxjs';
import { IPagedSets } from './paged-sets';

export interface IMySetsService {
  getMySets(pageNumber: number, pageSize: number): Observable<IPagedSets>;

  removeMySet(setId: string): Observable<void>;

  patchMySet(setId: string, newSet: Set, originalSet: Set): Observable<void>;

  createSet(set: Set): Observable<Set>;

  addSet(set: Set): Observable<Set>;
}
