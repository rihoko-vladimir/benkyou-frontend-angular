import { Observable } from 'rxjs';

export interface IAuthService {
  login(login: string, password: string): void;

  register(userName: string, email: string, firstName: string, lastName: string, password: string): Observable<string>;

  confirmEmailAddress(userId: string, confirmationCode: string): Observable<string>;

  resetPassword(email: string): Observable<void>;

  setNewPassword(newPassword: string, email: string, token: string): Observable<void>;

  resetPassword(email: string): Observable<void>;
}
