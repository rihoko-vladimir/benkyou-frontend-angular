import {createReducer, on} from "@ngrx/store";
import {accountError, getAccountInfoSuccess, loginSuccess, logout} from "../Actions/account.actions";

export interface IAccountState {
  id: string,
  firstName: string,
  lastName: string,
  userName: string,
  userRole: string,
  birthDay: string,
  avatarUrl: string,
  isTermsAccepted: boolean,
  isAccountPublic: boolean,
  about: string,
  error: { isError: boolean, errorMessage: string }
}

const initialState: IAccountState = {
  about: "",
  avatarUrl: "",
  birthDay: "",
  firstName: "",
  id: "",
  isAccountPublic: false,
  userRole: "user",
  lastName: "",
  userName: "",
  isTermsAccepted: true,
  error: {isError: false, errorMessage: ""}
}

export const accountReducer = createReducer(
  initialState,
  on(loginSuccess, (state, account) => ({
    about: account.about,
    avatarUrl: account.avatarUrl,
    birthDay: account.birthDay,
    firstName: account.firstName,
    lastName: account.lastName,
    isAccountPublic: account.isAccountPublic,
    isTermsAccepted: account.isTermsAccepted,
    userRole: account.userRole,
    userName: account.userName,
    id: account.id,
    error: {isError: false, errorMessage: ""}
  })),
  on(getAccountInfoSuccess, (store, account) => ({
    about: account.about,
    avatarUrl: account.avatarUrl,
    birthDay: account.birthDay,
    firstName: account.firstName,
    lastName: account.lastName,
    isAccountPublic: account.isAccountPublic,
    isTermsAccepted: account.isTermsAccepted,
    userRole: account.userRole,
    userName: account.userName,
    id: account.id,
    error: {isError: false, errorMessage: ""}
  })),
  on(accountError, (state, {errorMessage}) => ({
    ...state,
    error: {isError: true, errorMessage: errorMessage}
  })),
  on(logout, () => initialState)
)

