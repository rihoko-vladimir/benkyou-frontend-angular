import { IAccountService } from './Interfaces/account.service';
import { Account } from '../Models/Account';
import { Store } from '@ngrx/store';
import AppState from '../Redux/app.state';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import * as jsonpatch from 'fast-json-patch';
import { catchError, EMPTY } from 'rxjs';
import { accountError, getAccountInfoSuccess, loginSuccess } from '../Redux/Actions/account.actions';
import { UserResponse } from '../Models/Responses/UserResponse';
import { Injectable } from '@angular/core';
import { visibilityChangeSuccess } from '../Redux/Actions/snackbar.actions';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    private store: Store<AppState>,
    private httpClient: HttpClient,
    private appConfig: AppConfiguration
  ) {}

  updateUserAccount(updatedUserData: Account): void {
    let sourceUserData!: Account;
    this.store
      .select('account')
      .subscribe(value => {
        sourceUserData = {
          firstName: value.firstName,
          lastName: value.lastName,
          userName: value.userName,
          isAccountPublic: value.isAccountPublic,
          about: value.about,
          birthDay: value.birthDay
        };
      })
      .unsubscribe();
    const source = { ...sourceUserData };
    const observer = jsonpatch.observe<Account>(source);
    Object.assign(source, updatedUserData);
    const request = jsonpatch.generate(observer);
    this.httpClient
      .patch<UserResponse>(`${this.appConfig.apiEndpoint}/user/update-info`, request, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          this.store.dispatch(accountError({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe((userInfo: UserResponse) => {
        if (sourceUserData.isAccountPublic !== userInfo.isAccountPublic) {
          this.store.dispatch(visibilityChangeSuccess());
        }
        this.store.dispatch(
          loginSuccess({
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            userName: userInfo.userName,
            userRole: userInfo.userRole,
            isAccountPublic: userInfo.isAccountPublic,
            avatarUrl: userInfo.avatarUrl,
            about: userInfo.about,
            isTermsAccepted: userInfo.isTermsAccepted,
            birthDay: userInfo.birthDay,
            error: { isError: false, errorMessage: '' }
          })
        );
      });
  }

  uploadNewAvatar(file: File): void {
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    this.httpClient
      .put<UserResponse>(`${this.appConfig.apiEndpoint}/user/upload-avatar`, formData, {
        withCredentials: true
      })
      .pipe(
        catchError(error => {
          this.store.dispatch(accountError({ errorMessage: error.error ?? 'Service unavailable' }));
          return EMPTY;
        })
      )
      .subscribe((userInfo: UserResponse) => {
        this.store.dispatch(
          loginSuccess({
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            userName: userInfo.userName,
            userRole: userInfo.userRole,
            isAccountPublic: userInfo.isAccountPublic,
            avatarUrl: userInfo.avatarUrl,
            about: userInfo.about,
            isTermsAccepted: userInfo.isTermsAccepted,
            birthDay: userInfo.birthDay,
            error: { isError: false, errorMessage: '' }
          })
        );
      });
  }

  getAccountInfo(): void {
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
          getAccountInfoSuccess({
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
}
