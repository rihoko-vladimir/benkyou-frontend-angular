import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DEFAULT_ERROR_MESSAGE, HttpErrorInterceptor } from './HttpErrorInterceptor';

describe('HttpErrorInterceptor', () => {
  const req = new HttpRequest('GET', '/api/test');
  let interceptor: HttpErrorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpErrorInterceptor] });
    interceptor = TestBed.inject(HttpErrorInterceptor);
  });

  async function captureFailure(observable: Observable<unknown>): Promise<HttpErrorResponse> {
    try {
      await firstValueFrom(observable);
    } catch (error) {
      return error as HttpErrorResponse;
    }
    throw new Error('Expected the interceptor to error, but it succeeded');
  }

  it('passes through successful responses unchanged', async () => {
    const next = { handle: vi.fn(() => of('ok' as unknown)) };

    const value = await firstValueFrom(interceptor.intercept(req, next as never));

    expect(value).toBe('ok');
  });

  it('keeps the backend string error message on HttpErrorResponse', async () => {
    const error = new HttpErrorResponse({
      error: 'Invalid credentials',
      status: 400,
      statusText: 'Bad Request',
      url: '/api/test'
    });
    const next = { handle: vi.fn(() => throwError(() => error)) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe('Invalid credentials');
    expect(failure.status).toBe(400);
    expect(failure.statusText).toBe('Bad Request');
    expect(failure.url).toBe('/api/test');
  });

  it('falls back to the default message when the backend error is not a string', async () => {
    const error = new HttpErrorResponse({ error: { some: 'object' }, status: 500 });
    const next = { handle: vi.fn(() => throwError(() => error)) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('falls back to the default message when the backend error is an empty string', async () => {
    const error = new HttpErrorResponse({ error: '', status: 500 });
    const next = { handle: vi.fn(() => throwError(() => error)) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('normalizes non-HttpErrorResponse failures with a string error property (e.g. Offline)', async () => {
    const next = { handle: vi.fn(() => throwError(() => ({ error: 'Offline' }))) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe('Offline');
    expect(failure.status).toBe(0);
  });

  it('falls back to the default message for unrecognized failure shapes', async () => {
    const next = { handle: vi.fn(() => throwError(() => 'some random string')) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
    expect(failure.status).toBe(0);
  });

  it('falls back to the default message when error is null', async () => {
    const next = { handle: vi.fn(() => throwError(() => null)) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('falls back to the default message when the error object has a non-string error property', async () => {
    const next = { handle: vi.fn(() => throwError(() => ({ error: 123 }))) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('falls back to the default message for object failures without an error property', async () => {
    const next = { handle: vi.fn(() => throwError(() => new Error('boom'))) };

    const failure = await captureFailure(interceptor.intercept(req, next as never));

    expect(failure.error).toBe(DEFAULT_ERROR_MESSAGE);
    expect(failure.status).toBe(0);
  });
});
