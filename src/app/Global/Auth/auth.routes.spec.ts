import { authRoutes } from './auth.routes';
import { SetPasswordGuard } from '../../Guards/set-password.guard';

describe('authRoutes', () => {
  it('defines a single top-level route with four child pages', () => {
    expect(authRoutes.length).toBe(1);

    const children = authRoutes[0].children ?? [];
    const paths = children.map(c => c.path);

    expect(paths).toEqual(['', 'register', 'forgot-password/new-password', 'forgot-password']);
  });

  it('guards the new-password page with SetPasswordGuard', () => {
    const children = authRoutes[0].children ?? [];
    const newPasswordRoute = children.find(c => c.path === 'forgot-password/new-password')!;

    expect(newPasswordRoute.canActivate).toEqual([SetPasswordGuard]);
    expect(newPasswordRoute.pathMatch).toBe('full');
  });
});
