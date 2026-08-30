import { Account } from '../../Models/Account';
import { Observable } from 'rxjs';
import { UserResponse } from '../../Models/Responses/UserResponse';

export interface IAccountService {
  updateUserAccount(currentUserData: Account, updatedUserData: Account): Observable<UserResponse>;

  uploadNewAvatar(file: File): Observable<UserResponse>;

  getAccountInfo(): Observable<UserResponse>;
}
