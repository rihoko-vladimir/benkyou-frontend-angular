import Set from '../../Models/Set';

export interface IPagedSets {
  sets: Set[];
  pagesCount: number;
  currentPage: number;
}
