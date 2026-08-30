import Set from '../../Models/Set';

export interface PagedSets {
  sets: Set[];
  pagesCount: number;
  currentPage: number;
}
