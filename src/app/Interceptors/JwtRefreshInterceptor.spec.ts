import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JwtRefreshInterceptor } from './JwtRefreshInterceptor';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { logout } from '../Redux/Actions/account.actions';

describe('JwtRefreshInterceptor', () => {
  const req = new HttpRequest('GET', '/api/test');

  let interceptor: JwtRefreshInterceptor;
  let httpClient: { post: ReturnType<typeof vi.fn> };
  let store: { dispatch: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpClient = { post: vi.fn() };
    store = { dispatch: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        JwtRefreshInterceptor,
        { provide: HttpClient, useValue: httpClient },
        { provide: Store, useValue: store },
        { provide: Router, useValue: router },
        { provide: AppConfiguration, useValue: { apiEndpoint: 'http://test-api' } }
      ]
    });

    interceptor = TestBed.inject(JwtRefreshInterceptor);
  });

  it('passes through successful responses unchanged', async () => {
    const next = { handle: vi.fn(() => of('ok' as unknown)) };

    const value = await firstValueFrom(interceptor.intercept(req, next as never));

    expect(value).toBe('ok');
  });

  it('rethrows non-401 errors without refreshing tokens', async () => {
    const error = new HttpErrorResponse({ status: 500 });
    const next = { handle: vi.fn(() => throwError(() => error)) };

    await expect(firstValueFrom(interceptor.intercept(req, next as never))).rejects.toBe(error);
    expect(httpClient.post).not.toHaveBeenCalled();
  });

  it('refreshes tokens and retries the request on a 401', async () => {
    const error = new HttpErrorResponse({ status: 401 });
    let firstCall = true;
    const next = {
      handle: vi.fn(() => {
        if (firstCall) {
          firstCall = false;
          return throwError(() => error);
        }
        return of('retried' as unknown);
      })
    };
    httpClient.post.mockReturnValue(of({}));

    const value = await firstValueFrom(interceptor.intercept(req, next as never));

    expect(value).toBe('retried');
    expect(httpClient.post).toHaveBeenCalledWith('http://test-api/auth/refresh', {}, { withCredentials: true });
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('logs out and navigates to auth when refresh fails after a 401', async () => {
    const error = new HttpErrorResponse({ status: 401 });
    const next = { handle: vi.fn(() => throwError(() => error)) };
    httpClient.post.mockReturnValue(throwError(() => new Error('refresh failed')));

    await firstValueFrom(interceptor.intercept(req, next as never), { defaultValue: null });

    expect(store.dispatch).toHaveBeenCalledWith(logout());
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });
});
