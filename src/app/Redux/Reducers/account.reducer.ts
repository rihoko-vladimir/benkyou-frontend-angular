import {createReducer} from "@ngrx/store";

export interface AccountState{
  id : string,
  firstName : string,
  lastName : string,
  userName : string,
  userRole : string,
  birthDay : string,
  avatarUrl : string,
  isTermsAccepted : boolean,
  isAccountPublic : boolean,
  about : string
}

const initialState : AccountState = {
  about: "",
  avatarUrl:"",
  birthDay: "",
  firstName: "",
  id: "",
  isAccountPublic: false,
  userRole: "user",
  lastName: "",
  userName: "",
  isTermsAccepted : true
}

export const accountReducer = createReducer(
  initialState,

)
