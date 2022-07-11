import Set from "../../Models/Set"

export interface IMySetsService{
  getMySets(pageNumber : number, pageSize : number) : void

  removeMySet(setId : string) : void

  patchMySet(setId : string, newSet : Set) : void

  createSet(setRequest : Set) : void
}
