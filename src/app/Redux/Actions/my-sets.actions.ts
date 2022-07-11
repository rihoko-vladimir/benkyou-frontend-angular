import {createAction, props} from "@ngrx/store";
import Set from "../../Models/Set";

export const loadMySetsSuccess = createAction(
  "[My Sets Page] Load My Sets Success",
  props<{sets : Set[], pagesCount : number, pageNumber : number}>()
)

export const loadMySetsFailure = createAction(
  "[My Sets Page] Load My Sets Failure",
  props<{errorMessage : string}>()
)
