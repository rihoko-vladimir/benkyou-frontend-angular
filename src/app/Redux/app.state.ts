import {IStudyState} from "./Reducers/set-study.reducer";
import {ISetsState} from "./Reducers/all-sets.reducer";

export interface AppState{
  setStudy : IStudyState,
  allSets : ISetsState,
  mySets : ISetsState
}
