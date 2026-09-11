import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';
import { SetPasswordGuard } from './set-password.guard';

describe('SetPasswordGuard', () => {
  let guard: SetPasswordGuard;
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { createUrlTree: vi.fn(() => 'url-tree') };

    TestBed.configureTestingModule({
      providers: [SetPasswordGuard, { provide: Store, useValue: {} }, { provide: Router, useValue: router }]
    });

    guard = TestBed.inject(SetPasswordGuard);
  });

  const makeRoute = (queryParams: Record<string, string | null>) =>
    ({ queryParams }) as unknown as ActivatedRouteSnapshot;

  it('allows activation when both token and email are present', () => {
    const result = guard.canActivate(makeRoute({ token: 'tok-1', email: 'a@test.com' }));

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to auth when token is an empty string', () => {
    const result = guard.canActivate(makeRoute({ token: '', email: 'a@test.com' }));

    expect(router.createUrlTree).toHaveBeenCalledWith(['auth']);
    expect(result).toBe('url-tree');
  });

  it('redirects to auth when email is an empty string', () => {
    guard.canActivate(makeRoute({ token: 'tok-1', email: '' }));

    expect(router.createUrlTree).toHaveBeenCalledWith(['auth']);
  });

  it('redirects to auth when token is null', () => {
    guard.canActivate(makeRoute({ token: null, email: 'a@test.com' }));

    expect(router.createUrlTree).toHaveBeenCalledWith(['auth']);
  });

  it('redirects to auth when email is null', () => {
    guard.canActivate(makeRoute({ token: 'tok-1', email: null }));

    expect(router.createUrlTree).toHaveBeenCalledWith(['auth']);
  });
});
