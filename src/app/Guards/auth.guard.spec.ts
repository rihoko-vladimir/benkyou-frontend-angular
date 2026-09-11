import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  const configureGuard = (accountId: string) => {
    router = { createUrlTree: vi.fn(() => 'url-tree') };
    const storeStub = { select: vi.fn(() => of({ id: accountId })) };

    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Store, useValue: storeStub }, { provide: Router, useValue: router }]
    });

    guard = TestBed.inject(AuthGuard);
  };

  it('returns true when the account id is set (logged in)', () => {
    configureGuard('user-1');

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to /auth when the account id is empty (logged out)', () => {
    configureGuard('');

    const result = guard.canActivate();

    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth']);
    expect(result).toBe('url-tree');
  });
});
