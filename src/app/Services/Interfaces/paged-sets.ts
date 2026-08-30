import Set from '../../Models/Set';

/**
 * Result of a paged set listing (GET /sets/my-sets, GET /sets/all-sets):
 * the mapped sets of the current page plus paging metadata.
 */
export interface IPagedSets {
  sets: Set[];
  pagesCount: number;
  currentPage: number;
}
