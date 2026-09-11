import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TimeoutInterceptor } from './TimeoutInterceptor';

describe('TimeoutInterceptor', () => {
  const req = new HttpRequest('GET', '/api/test');
  let interceptor: TimeoutInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TimeoutInterceptor] });
    interceptor = TestBed.inject(TimeoutInterceptor);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('exposes isOnline from navigator.onLine', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    expect(interceptor.isOnline).toBe(true);

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    expect(interceptor.isOnline).toBe(false);
  });

  it('passes through successful responses unchanged', async () => {
    const next = { handle: vi.fn(() => of('ok' as unknown)) };

    const value = await firstValueFrom(interceptor.intercept(req, next as never));

    expect(value).toBe('ok');
  });

  it('rethrows the original error immediately when online', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const error = new Error('boom');
    const next = { handle: vi.fn(() => throwError(() => error)) };

    await expect(firstValueFrom(interceptor.intercept(req, next as never))).rejects.toBe(error);
  });

  it('throws an Offline error instead of retrying when offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const next = { handle: vi.fn(() => throwError(() => new Error('boom'))) };

    await expect(firstValueFrom(interceptor.intercept(req, next as never))).rejects.toEqual({ error: 'Offline' });
  });

  it('errors with a timeout when the request takes too long', async () => {
    vi.useFakeTimers();
    const subject = new Subject<unknown>();
    const next = { handle: vi.fn(() => subject.asObservable()) };

    const failure = expect(firstValueFrom(interceptor.intercept(req, next as never))).rejects.toBeTruthy();
    await vi.advanceTimersByTimeAsync(10001);
    await failure;
  });
});
