export interface IAllSetsService {
  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): void;
}
