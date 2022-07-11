import Set from "../../Models/Set"
import {SetRequest} from "../../Models/Requests/SetRequest";

export interface IMySetsService{
  getMySets(pageNumber : number, pageSize : number) : void

  removeMySet(setId : string) : void

  patchMySet(setId : string, newSet : Set) : void

  createSet(setRequest : SetRequest) : void
}
