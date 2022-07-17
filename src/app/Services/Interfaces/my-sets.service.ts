import Set from "../../Models/Set"

export interface IMySetsService {
  getMySets(pageNumber: number, pageSize: number): void

  removeMySet(setId: string,  pageNumber: number, pageSize: number): void

  patchMySet(setId: string, newSet: Set, originalSet : Set): void

  createSet(setRequest: Set): void

  addSet(set : Set) : void
}
