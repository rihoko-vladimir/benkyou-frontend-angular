import {Injectable} from "@angular/core";
import {IAuthService} from "./Interfaces/auth.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../Constants/AppConfiguration";

@Injectable({
  providedIn: "root",
  deps: [AppConfiguration]
})
export class AuthService implements IAuthService{
  constructor(private httpClient: HttpClient, private appConfig: AppConfiguration) {
  }
  confirmEmailAddress(userId: string, confirmationCode: string): Observable<string> {
    let confirmationRequest = {
      userId,
      emailCode: confirmationCode
    }

    return this.httpClient.post<string>(`${this.appConfig.apiEndpoint}/auth/confirm-email`,
      confirmationRequest)
  }

  login(login: string, password: string): Observable<void> {
    let credentials = {
      email: login,
      password: password
    }

    return this.httpClient.post<void>(`${this.appConfig.apiEndpoint}/auth/login`,
      credentials, {
      withCredentials: true
    })
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
