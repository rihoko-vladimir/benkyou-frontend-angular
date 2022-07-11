import {ISetsState} from "./all-sets.reducer";
import {createReducer, on} from "@ngrx/store";
import {loadMySetsFailure, loadMySetsSuccess} from "../Actions/my-sets.actions";

const initialState: ISetsState = {
  currentPage: 0,
  pagesCount: 0,
  sets: [],
  setsCount: 9,
}

export const mySetsReducer = createReducer(
  initialState,
  on(loadMySetsSuccess, (state, {sets, pagesCount, pageNumber}) => ({
    sets: sets,
    pagesCount: pagesCount,
    currentPage: pageNumber,
    setsCount: state.setsCount,
    errorMessage: undefined
  })),
  on(loadMySetsFailure, (state, {errorMessage}) => ({
    ...state,
    errorMessage: errorMessage
  }))
)
