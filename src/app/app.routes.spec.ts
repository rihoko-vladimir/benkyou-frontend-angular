import { routes } from './app.routes';

describe('app.routes', () => {
  it('defines the top-level auth, hub, not-found and fallback routes', () => {
    expect(routes.length).toBe(5);

    const paths = routes.map(r => r.path);
    expect(paths).toEqual(['auth', 'hub', 'not-found', '', '**']);
  });

  it('lazy-loads the auth routes', async () => {
    const authRoute = routes.find(r => r.path === 'auth')!;
    const loaded = await (authRoute.loadChildren as () => Promise<unknown>)();

    expect(loaded).toBeDefined();
  });

  it('lazy-loads the hub routes and guards them with AuthGuard', async () => {
    const hubRoute = routes.find(r => r.path === 'hub')!;

    expect(hubRoute.canActivate?.length).toBe(1);

    const loaded = await (hubRoute.loadChildren as () => Promise<unknown>)();

    expect(loaded).toBeDefined();
  });

  it('redirects the empty path to hub and unknown paths to not-found', () => {
    const emptyRoute = routes.find(r => r.path === '')!;
    const wildcardRoute = routes.find(r => r.path === '**')!;

    expect(emptyRoute.redirectTo).toBe('hub');
    expect(emptyRoute.pathMatch).toBe('full');
    expect(wildcardRoute.redirectTo).toBe('not-found');
  });
});
