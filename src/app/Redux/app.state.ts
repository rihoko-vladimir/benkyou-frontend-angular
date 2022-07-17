import {IStudyState} from "./Reducers/set-study.reducer";
import {ISetsState} from "./Reducers/all-sets.reducer";
import {IAccountState} from "./Reducers/account.reducer";
import {ISnackbarState} from "./Reducers/snackbar.reducer";

export default interface AppState{
  setStudy : IStudyState,
  allSets : ISetsState,
  mySets : ISetsState,
  account : IAccountState,
  snackbar : ISnackbarState
}
