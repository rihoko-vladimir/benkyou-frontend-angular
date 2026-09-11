import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { UserResponse } from '../Models/Responses/UserResponse';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiEndpoint = 'http://test-api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfiguration, useValue: { apiEndpoint } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('confirmEmailAddress posts userId and emailCode', () => {
    let result: string | undefined;
    service.confirmEmailAddress('user-1', 'code-1').subscribe(r => (result = r));

    const req = httpMock.expectOne(`${apiEndpoint}/auth/confirm-email`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId: 'user-1', emailCode: 'code-1' });
    req.flush('ok');

    expect(result).toBe('ok');
  });

  it('login posts credentials with withCredentials', () => {
    service.login('taro', 'pw').subscribe();

    const req = httpMock.expectOne(`${apiEndpoint}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual({ login: 'taro', password: 'pw' });
    req.flush(null);
  });

  it('getUserInfo gets the current user info with credentials', () => {
    let result: UserResponse | undefined;
    service.getUserInfo().subscribe(r => (result = r));

    const req = httpMock.expectOne(`${apiEndpoint}/user/get-info`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1' } as UserResponse);

    expect(result).toEqual({ id: '1' });
  });

  it('register posts the registration request with isTermsAccepted true', () => {
    service.register('taro', 'taro@test.com', 'Taro', 'Yamada', 'pw').subscribe();

    const req = httpMock.expectOne(`${apiEndpoint}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userName: 'taro',
      email: 'taro@test.com',
      firstName: 'Taro',
      lastName: 'Yamada',
      password: 'pw',
      isTermsAccepted: true
    });
    req.flush('ok');
  });

  it('resetPassword posts to the reset-password endpoint with the email query param', () => {
    service.resetPassword('taro@test.com').subscribe();

    const req = httpMock.expectOne(`${apiEndpoint}/auth/reset-password?email=taro@test.com`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('setNewPassword posts the new password with token and email query params', () => {
    service.setNewPassword('newPw', 'taro@test.com', 'tok-1').subscribe();

    const req = httpMock.expectOne(`${apiEndpoint}/auth/confirm-reset-password?token=tok-1&email=taro@test.com`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: 'newPw' });
    req.flush(null);
  });
});
