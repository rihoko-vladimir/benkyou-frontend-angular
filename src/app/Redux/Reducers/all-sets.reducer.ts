import Set from "../../Models/Set"
import {createReducer, on} from "@ngrx/store";
import {loadAllSetsFailure, loadAllSetsSuccess} from "../Actions/all-sets.actions";
import {logout} from "../Actions/account.actions";

export interface ISetsState {
  sets: Set[],
  currentPage: number,
  pagesCount: number,
  setsCount: number,
  errorMessage? :string,
}

const initialState: ISetsState = {
  currentPage: 1,
  pagesCount: 1,
  sets: [],
  setsCount: 9,
  errorMessage : undefined,
}

export const allSetsReducer = createReducer(
  initialState,
  on(loadAllSetsSuccess, (state, {sets, pagesCount, pageNumber}) => ({
    currentPage : pageNumber,
    sets: sets,
    pagesCount: pagesCount,
    setsCount : state.setsCount,
    errorMessage : undefined
  })),
  on(loadAllSetsFailure, (state, {errorMessage}) => ({
    ...state,
    errorMessage : errorMessage
  })),
  on(logout, () => initialState)
)
