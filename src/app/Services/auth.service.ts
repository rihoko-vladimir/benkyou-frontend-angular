import {Injectable} from "@angular/core";
import {IAuthService} from "./Interfaces/auth.service";
import {catchError, EMPTY, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../Constants/AppConfiguration";
import {Store} from "@ngrx/store";
import {AppState} from "../Redux/app.state";
import {accountError, loginSuccess} from "../Redux/Actions/account.actions";
import {UserResponse} from "../Models/Responses/UserResponse";

@Injectable({
  providedIn: "root",
  deps: [AppConfiguration]
})
export class AuthService implements IAuthService{

  constructor(private httpClient: HttpClient, private appConfig: AppConfiguration, private store : Store<AppState>) {
  }

  confirmEmailAddress(userId: string, confirmationCode: string): Observable<string> {
    let confirmationRequest = {
      userId,
      emailCode: confirmationCode
    }

    return this.httpClient.post<string>(`${this.appConfig.apiEndpoint}/auth/confirm-email`,
      confirmationRequest)
  }

  login(login: string, password: string): void {
    let credentials = {
      email: login,
      password: password
    }

    this.httpClient.post<void>(`${this.appConfig.apiEndpoint}/auth/login`,
      credentials, {
      withCredentials: true
    })
      .pipe(
        catchError(error => {
          this.store.dispatch(accountError({errorMessage : error}))
          return EMPTY
        })
      )
      .subscribe(() => {
        this.getUserInfo()
      })
  }

  getUserInfo() : void{
    this.httpClient.get<UserResponse>(`${this.appConfig.apiEndpoint}/auth/login`)
  }

  register(userName: string, email: string, firstName: string, lastName: string, password: string): Observable<string> {
    let registrationRequest = {
      userName,
      email,
      firstName,
      lastName,
      password,
      isTermsAccepted: true
    }

    return this.httpClient.post<string>(`${this.appConfig.apiEndpoint}/auth/register`,
      registrationRequest)
  }

  resetPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.appConfig.apiEndpoint}/auth/reset-password?email=${email}`,
      null)
  }

  setNewPassword(newPassword: string, email: string, token: string): Observable<void> {
    let setNewPasswordRequest = {
      password: newPassword
    }

    return this.httpClient.post<void>(`${this.appConfig.apiEndpoint}/auth/confirm-reset-password?token=${token}&email=${email}`,
      setNewPasswordRequest)
  }

}
