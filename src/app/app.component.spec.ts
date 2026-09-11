import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts, provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';
import { AppComponent } from './app.component';
import { ThemePreference } from './Models/Enums/ThemePreference';
import { ThemeService } from './Services/theme.service';

@Component({ template: '' })
class TestRouteComponent {}

describe('AppComponent', () => {
  let theme$: BehaviorSubject<ThemePreference>;
  let matchMediaMock: { matches: boolean; addEventListener: ReturnType<typeof vi.fn> };
  let changeListener: ((event: { matches: boolean }) => void) | undefined;

  beforeEach(async () => {
    theme$ = new BehaviorSubject<ThemePreference>(ThemePreference.Light);
    changeListener = undefined;
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn((_event: string, listener: (event: { matches: boolean }) => void) => {
        changeListener = listener;
      })
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => matchMediaMock)
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // AppComponent is a standalone component (post-migration), so it goes
      // into `imports`, not `declarations`. The template renders
      // <router-outlet name="primary">, whose real directive needs a live
      // Router - provideRouter supplies one; the single empty-path route lets
      // tests assert the outlet animation data.
      // NOTE: do NOT stub ApplicationRef here — Angular 18's
      // ChangeDetectionSchedulerImpl injects the real one and the bare
      // { tick } useValue stub breaks its constructor.
      providers: [
        provideRouter([{ path: '', component: TestRouteComponent, data: { animation: 'authPage' } }]),
        { provide: ThemeService, useValue: { getTheme: () => theme$.asObservable() } }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    // The component writes theme classes onto document.body; clean them up so
    // the jsdom shared between spec files (non-isolated runner) stays deterministic.
    document.body.classList.remove('light-theme', 'dark-theme');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('applies the theme class matching the theme preference', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('switches to the dark theme class when the preference changes', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    TestBed.createComponent(AppComponent);

    theme$.next(ThemePreference.Dark);

    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('follows the system preference when the theme is set to auto', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    TestBed.createComponent(AppComponent);

    matchMediaMock.matches = true;
    theme$.next(ThemePreference.Auto);
    expect(document.body.classList.contains('dark-theme')).toBe(true);

    matchMediaMock.matches = false;
    theme$.next(ThemePreference.Auto);
    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('falls back to the light theme when matchMedia is unavailable', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    TestBed.createComponent(AppComponent);

    vi.stubGlobal('matchMedia', undefined);
    theme$.next(ThemePreference.Auto);

    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('reacts to system colour scheme changes', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    TestBed.createComponent(AppComponent);
    expect(changeListener).toBeDefined();

    changeListener!({ matches: true });
    expect(document.body.classList.contains('dark-theme')).toBe(true);

    changeListener!({ matches: false });
    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('returns the route animation data of the activated route', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.getAppRoutingAnimations()).toBeUndefined();

    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();

    const contexts = TestBed.inject(ChildrenOutletContexts);
    expect(contexts.getContext('primary')?.route).toBeTruthy();
    expect(fixture.componentInstance.getAppRoutingAnimations()).toBe('authPage');
  });
});
