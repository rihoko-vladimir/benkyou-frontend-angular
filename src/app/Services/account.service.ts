import { IAccountService } from './Interfaces/account.service';
import { Account } from '../Models/Account';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../Constants/AppConfiguration';
import * as jsonpatch from 'fast-json-patch';
import { Observable } from 'rxjs';
import { UserResponse } from '../Models/Responses/UserResponse';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AccountService implements IAccountService {
  private httpClient = inject(HttpClient);
  private appConfig = inject(AppConfiguration);


  updateUserAccount(currentUserData: Account, updatedUserData: Account): Observable<UserResponse> {
    const source: Account = { ...currentUserData };
    const observer = jsonpatch.observe<Account>(source);
    Object.assign(source, { ...updatedUserData });
    const request = jsonpatch.generate(observer);
    return this.httpClient.patch<UserResponse>(`${this.appConfig.apiEndpoint}/user/update-info`, request, {
      withCredentials: true
    });
  }

  uploadNewAvatar(file: File): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    return this.httpClient.put<UserResponse>(`${this.appConfig.apiEndpoint}/user/upload-avatar`, formData, {
      withCredentials: true
    });
  }

  getAccountInfo(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${this.appConfig.apiEndpoint}/user/get-info`, {
      withCredentials: true
    });
  }
}
