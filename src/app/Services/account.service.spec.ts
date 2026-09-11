import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { Account } from '../Models/Account';
import { UserResponse } from '../Models/Responses/UserResponse';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  const apiEndpoint = 'http://test-api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfiguration, useValue: { apiEndpoint } }
      ]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends a PATCH json-patch request diffing current and updated account data', () => {
    const current: Account = {
      firstName: 'Taro',
      lastName: 'Yamada',
      userName: 'taro',
      birthDay: '1990-01-01',
      isAccountPublic: false,
      about: ''
    };
    const updated: Account = { ...current, firstName: 'Jiro' };

    let response: UserResponse | undefined;
    service.updateUserAccount(current, updated).subscribe(r => (response = r));

    const req = httpMock.expectOne(`${apiEndpoint}/user/update-info`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.withCredentials).toBe(true);
    expect(Array.isArray(req.request.body)).toBe(true);
    req.flush({ id: '1' } as UserResponse);

    expect(response).toEqual({ id: '1' });
  });

  it('uploads a new avatar as multipart form data', () => {
    const file = new File(['content'], 'avatar.png');

    let response: UserResponse | undefined;
    service.uploadNewAvatar(file).subscribe(r => (response = r));

    const req = httpMock.expectOne(`${apiEndpoint}/user/upload-avatar`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({ id: '1' } as UserResponse);

    expect(response).toEqual({ id: '1' });
  });

  it('fetches the current account info', () => {
    let response: UserResponse | undefined;
    service.getAccountInfo().subscribe(r => (response = r));

    const req = httpMock.expectOne(`${apiEndpoint}/user/get-info`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1' } as UserResponse);

    expect(response).toEqual({ id: '1' });
  });
});
