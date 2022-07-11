import {createAction, props} from "@ngrx/store";
import {AccountState} from "../Reducers/account.reducer";

export const loginSuccess = createAction(
  "[Login page] Login Success",
  props<AccountState>()
)

export const logout = createAction(
  "[Account page] Log out"
)

export const changeUserInfoSuccess = createAction(
  "[Account page] Change user info success",
  props<AccountState>()
)

export const changeUserAvatarSuccess = createAction(
  "[Account page] Change user avatar success",
  props<{avatarUrl : string}>()
)

export const accountError = createAction(
  "[Login page] Account error",
  props<{errorMessage : string}>()
)
