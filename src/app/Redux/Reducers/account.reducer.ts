import {createReducer, on} from "@ngrx/store";
import {loginSuccess, logout} from "../Actions/account.actions";

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
  about: string
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
  isTermsAccepted: true
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
    id: account.id
  })),
  on(logout, () => initialState)
)

