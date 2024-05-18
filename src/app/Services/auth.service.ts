import { Injectable } from '@angular/core';
import { IAuthService } from './Interfaces/auth.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { accountError, loginSuccess } from '../Redux/Actions/account.actions';
import { UserResponse } from '../Models/Responses/UserResponse';

@Injectable({
  providedIn: 'root',
  deps: [AppConfiguration]
})
export class AuthService implements IAuthService {
  constructor(
    private httpClient: HttpClient,
    private appConfig: AppConfiguration,
    private store: Store<AppState>
  ) {}

  confirmEmailAddress(userId: string, confirmationCode: string): Observable<string> {
    const confirmationRequest = {
      userId,
      emailCode: confirmationCode
    };

    return this.httpClient.post<string>(`${this.appConfig.apiEndpoint}/auth/confirm-email`, confirmationRequest);
  }

  login(login: string, password: string) {
    const credentials = {
      login: login,
      password: password
    };

    this.httpClient
      .post(`${this.appConfig.apiEndpoint}/auth/login`, credentials, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          console.log(error);
          this.store.dispatch(accountError({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.getUserInfo();
      });
  }

  getUserInfo() {
    this.httpClient
      .get<UserResponse>(`${this.appConfig.apiEndpoint}/user/get-info`, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          this.store.dispatch(accountError({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe(value => {
        this.store.dispatch(
          loginSuccess({
            isTermsAccepted: true,
            userName: value.userName,
            firstName: value.firstName,
            lastName: value.lastName,
            userRole: value.userRole,
            isAccountPublic: value.isAccountPublic,
            birthDay: value.birthDay,
            about: value.about,
            avatarUrl: value.avatarUrl,
            id: value.id,
            error: { isError: false, errorMessage: '' }
          })
        );
      });
  }

  register(userName: string, email: string, firstName: string, lastName: string, password: string) {
    const registrationRequest = {
      userName,
      email,
      firstName,
      lastName,
      password,
      isTermsAccepted: true
    };

    return this.httpClient.post<string>(`${this.appConfig.apiEndpoint}/auth/register`, registrationRequest);
  }

  resetPassword(email: string) {
    return this.httpClient.post<void>(`${this.appConfig.apiEndpoint}/auth/reset-password?email=${email}`, null);
  }

  setNewPassword(newPassword: string, email: string, token: string) {
    const setNewPasswordRequest = {
      password: newPassword
    };

    return this.httpClient.post<void>(
      `${this.appConfig.apiEndpoint}/auth/confirm-reset-password?token=${token}&email=${email}`,
      setNewPasswordRequest
    );
  }

  getAssertionOptions() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.httpClient.get<any>(`${this.appConfig.apiEndpoint}/auth/assertion-options`);
  }
}
