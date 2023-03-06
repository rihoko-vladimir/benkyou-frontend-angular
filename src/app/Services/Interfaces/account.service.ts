import {Account} from "../../Models/Account";

export interface IAccountService{
  updateUserAccount(updatedUserData : Account) : void

  uploadNewAvatar(file : File) : void

  getAccountInfo() : void
}
