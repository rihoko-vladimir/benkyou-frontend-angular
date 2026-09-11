import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, NEVER, Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { HubComponent } from './hub.component';
import { ISnackbarState } from '../../Redux/Reducers/snackbar.reducer';
import { dismissSnackbar } from '../../Redux/Actions/snackbar.actions';
import { accountInitialState } from '../../Redux/Reducers/account.reducer';
import { selectSnackbar } from '../../Redux/Selectors/selectors';
import { AuthService } from '../../Services/auth.service';
import { ThemeService } from '../../Services/theme.service';
import { ThemePreference } from '../../Models/Enums/ThemePreference';

describe('HubComponent', () => {
  let component: HubComponent;
  let fixture: ComponentFixture<HubComponent>;
  let store: { select: (selector?: unknown) => never; dispatch: ReturnType<typeof vi.fn> };
  let snackbarState$: BehaviorSubject<ISnackbarState>;
  let routerEvents$: Subject<unknown>;
  let afterDismissed$: Subject<void>;
  let snackbar: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackbarState$ = new BehaviorSubject<ISnackbarState>({ isShown: false, message: '' });
    const accountState$ = new BehaviorSubject(accountInitialState);
    // Only the snackbar slice drives this component; the child
    // AccountInfoListItemComponent selects the account slice.
    store = {
      select: (selector?: unknown) => (selector === selectSnackbar ? snackbarState$ : accountState$) as never,
      dispatch: vi.fn()
    };
    routerEvents$ = new Subject();
    afterDismissed$ = new Subject<void>();

    TestBed.configureTestingModule({
      imports: [HubComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: AuthService, useValue: { getUserInfo: () => NEVER } },
        { provide: ThemeService, useValue: { getTheme: () => of(ThemePreference.Auto), setTheme: vi.fn() } }
      ]
    });

    // Router.events must be stubbed before the component is constructed: the
    // toSignal() field initializer captures the router's events observable while
    // TestBed.createComponent() instantiates the component.
    const router = TestBed.inject(Router);
    Object.defineProperty(router, 'events', { value: routerEvents$.asObservable(), configurable: true });

    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;

    // MatSnackBarModule is part of the component's own imports, so its provider
    // shadows any TestBed override; patch the instance the component injects.
    const injectedSnackbar = fixture.debugElement.injector.get(MatSnackBar);
    snackbar = {
      open: vi.spyOn(injectedSnackbar, 'open').mockReturnValue({
        afterDismissed: () => afterDismissed$.asObservable()
      } as never)
    };
  });

  it('creates with drawer hidden by default', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isShown()).toBe(false);
  });

  describe('isShown signal driven by router NavigationEnd events', () => {
    it('becomes true when navigating away from /hub/study', () => {
      fixture.detectChanges();
      routerEvents$.next(new NavigationEnd(1, '/hub/my-sets', '/hub/my-sets'));
      fixture.detectChanges();
      expect(component.isShown()).toBe(true);
    });

    it('stays false when navigating to /hub/study', () => {
      fixture.detectChanges();
      routerEvents$.next(new NavigationEnd(1, '/hub/study', '/hub/study'));
      fixture.detectChanges();
      expect(component.isShown()).toBe(false);
    });

    it('ignores non-NavigationEnd events', () => {
      fixture.detectChanges();
      routerEvents$.next({ someOtherEvent: true });
      fixture.detectChanges();
      expect(component.isShown()).toBe(false);
    });
  });

  describe('snackbar effect', () => {
    it('does not show a snackbar when isShown is false', () => {
      fixture.detectChanges();
      expect(snackbar.open).not.toHaveBeenCalled();
    });

    it('shows the snackbar and dispatches dismissSnackbar after dismissal', () => {
      fixture.detectChanges();
      snackbarState$.next({ isShown: true, message: 'Set was created successfully' });
      fixture.detectChanges();

      expect(snackbar.open).toHaveBeenCalledWith('Set was created successfully', undefined, {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start'
      });

      afterDismissed$.next();
      expect(store.dispatch).toHaveBeenCalledWith(dismissSnackbar());
    });
  });

  describe('prepareRoute', () => {
    it('returns undefined for a falsy outlet', () => {
      fixture.detectChanges();
      expect(component.prepareRoute(null as unknown as RouterOutlet)).toBeFalsy();
    });

    it('returns the animation data from the outlet when present', () => {
      fixture.detectChanges();
      const outlet = { activatedRouteData: { animation: 'anim' } } as unknown as RouterOutlet;
      expect(component.prepareRoute(outlet)).toBe('anim');
    });
  });

  it('getHubRoutingAnimations returns undefined without an active route context', () => {
    fixture.detectChanges();
    expect(component.getHubRoutingAnimations()).toBeUndefined();
  });
});
