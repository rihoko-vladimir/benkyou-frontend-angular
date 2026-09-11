import { vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ThemeService } from './app/Services/theme.service';
import { AuthService } from './app/Services/auth.service';
import { AccountService } from './app/Services/account.service';
import { AllSetsService } from './app/Services/all-sets.service';
import { MySetsService } from './app/Services/my-sets.service';
import { SetsApiService } from './app/Services/sets-api.service';
import { AuthGuard } from './app/Guards/auth.guard';
import { SetPasswordGuard } from './app/Guards/set-password.guard';
import { JwtRefreshInterceptor } from './app/Interceptors/JwtRefreshInterceptor';
import { HttpErrorInterceptor } from './app/Interceptors/HttpErrorInterceptor';
import { TimeoutInterceptor } from './app/Interceptors/TimeoutInterceptor';

vi.mock('@angular/platform-browser', () => ({
  bootstrapApplication: vi.fn(() => Promise.reject(new Error('bootstrap failed')))
}));

const providerEntries = (provider: unknown): Record<string, unknown>[] => {
  const entry = provider as Record<string, unknown> | null;
  return entry && typeof entry === 'object' && Array.isArray(entry['ɵproviders'])
    ? (entry['ɵproviders'] as Record<string, unknown>[])
    : [];
};

const allProviderEntries = (providers: unknown[]): Record<string, unknown>[] => providers.flatMap(providerEntries);

const isMultiInterceptor = (provider: unknown, interceptor: unknown) =>
  (provider as Record<string, unknown>)['provide'] === HTTP_INTERCEPTORS &&
  (provider as Record<string, unknown>)['useClass'] === interceptor;

describe('main', () => {
  let bootstrapApplication: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let providers: unknown[];
  let ngDevModeAfterImport: unknown;

  beforeAll(async () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    // main.ts reads environment.production at module scope and the bundled spec chunk
    // evaluates it exactly once, so the flag is flipped before that single import (to
    // exercise the production branch) and every touched global is restored right after.
    const { environment } = await import('./environments/environment');
    environment.production = true;
    const ngDevModeBeforeImport = (globalThis as Record<string, unknown>)['ngDevMode'];

    const platformBrowser = await import('@angular/platform-browser');
    bootstrapApplication = platformBrowser.bootstrapApplication as unknown as ReturnType<typeof vi.fn>;
    await import('./main');
    await Promise.resolve();

    ngDevModeAfterImport = (globalThis as Record<string, unknown>)['ngDevMode'];
    environment.production = false;
    (globalThis as Record<string, unknown>)['ngDevMode'] = ngDevModeBeforeImport;

    providers = ((bootstrapApplication.mock.calls[0]?.[1] as { providers?: unknown[] })?.providers ?? []) as unknown[];
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('bootstraps AppComponent', () => {
    expect(bootstrapApplication).toHaveBeenCalledTimes(1);
    const [component] = bootstrapApplication.mock.calls[0] as [unknown, unknown];

    expect(component).toBe(AppComponent);
  });

  it('registers zoneless change detection and the app routes', () => {
    const expectedZonelessTokens = providerEntries(provideZonelessChangeDetection()).map(entry => entry['provide']);
    const actualTokens = allProviderEntries(providers).map(entry => entry['provide']);

    expect(expectedZonelessTokens.some(token => actualTokens.includes(token))).toBe(true);
    expect(allProviderEntries(providers).some(entry => entry['useValue'] === routes)).toBe(true);
  });

  it('provides the app services, guards, interceptors and stepper options', () => {
    expect(providers).toContain(ThemeService);
    expect(providers).toContain(AuthService);
    expect(providers).toContain(AllSetsService);
    expect(providers).toContain(MySetsService);
    expect(providers).toContain(SetsApiService);
    expect(providers).toContain(AccountService);
    expect(providers).toContain(AuthGuard);
    expect(providers).toContain(SetPasswordGuard);
    expect(providers.some(provider => isMultiInterceptor(provider, JwtRefreshInterceptor))).toBe(true);
    expect(providers.some(provider => isMultiInterceptor(provider, HttpErrorInterceptor))).toBe(true);
    expect(providers.some(provider => isMultiInterceptor(provider, TimeoutInterceptor))).toBe(true);
    expect(
      providers.some(provider => (provider as Record<string, unknown>)['provide'] === STEPPER_GLOBAL_OPTIONS)
    ).toBe(true);
  });

  it('enables production mode when environment.production is true', () => {
    expect(ngDevModeAfterImport).toBe(false);
  });

  it('skips the store devtools provider in a production environment', () => {
    const descriptions = allProviderEntries(providers).map(entry => String(entry['provide']));

    expect(descriptions.some(description => description.includes('store-devtools'))).toBe(false);
  });

  it('reports a failed bootstrap through console.error', async () => {
    await vi.waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({ message: 'bootstrap failed' }))
    );
  });
});
