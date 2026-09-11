import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../Services/auth.service';
import { UserResponse } from '../../../Models/Responses/UserResponse';
import { accountError, accountInfoSuccess } from '../../../Redux/Actions/account.actions';
import { IAccountState, accountInitialState } from '../../../Redux/Reducers/account.reducer';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let accountState$: BehaviorSubject<IAccountState>;
  let authService: { login: ReturnType<typeof vi.fn>; getUserInfo: ReturnType<typeof vi.fn> };
  let snackbar: MatSnackBar;
  let router: Router;

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>(accountInitialState);
    store = { select: () => accountState$, dispatch: vi.fn() };
    authService = { login: vi.fn(), getUserInfo: vi.fn() };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: store },
        { provide: AuthService, useValue: authService }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    // The component imports MatSnackBarModule, which provides MatSnackBar in
    // its own injector and shadows a testing-module override, so spy on the
    // instance the component actually injects.
    snackbar = fixture.debugElement.injector.get(MatSnackBar);
    vi.spyOn(snackbar, 'open');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('form validation error messages', () => {
    it('returns email format error', () => {
      component.loginControl.setValue('not-an-email');
      expect(component.getEmailErrorMessage()).toBe('Incorrect email provided');
    });

    it('returns required error for empty login', () => {
      component.loginControl.setValue('');
      expect(component.getEmailErrorMessage()).toBe('This field is required to log in :P');
    });

    it('returns unknown error message when no other error applies', () => {
      component.loginControl.setValue('valid@mail.com');
      component.loginControl.setErrors({ somethingElse: true });
      expect(component.getEmailErrorMessage()).toBe('An Unknown error have occurred');
    });

    it('returns required error for empty password', () => {
      component.passwordControl.setValue('');
      expect(component.getPasswordErrorMessage()).toBe('This field can not be empty');
    });

    it('returns unknown error message for password when no other error applies', () => {
      component.passwordControl.setValue('something');
      component.passwordControl.setErrors({ somethingElse: true });
      expect(component.getPasswordErrorMessage()).toBe('An Unknown error have occurred');
    });
  });

  describe('onLoginClicked', () => {
    it('marks controls touched when invalid', () => {
      component.loginControl.setValue('');
      component.passwordControl.setValue('');

      component.onLoginClicked();

      expect(component.loginControl.touched).toBe(true);
      expect(component.passwordControl.touched).toBe(true);
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('logs in and loads user info on success', () => {
      component.loginControl.setValue('user@mail.com');
      component.passwordControl.setValue('Password1');
      authService.login.mockReturnValue(of(undefined));
      authService.getUserInfo.mockReturnValue(of({ id: '1' } as unknown as UserResponse));

      component.onLoginClicked();

      expect(component.isLoading()).toBe(true);
      expect(authService.login).toHaveBeenCalledWith('user@mail.com', 'Password1');
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: accountInfoSuccess.type }));
    });

    it('dispatches accountError when login fails', () => {
      component.loginControl.setValue('user@mail.com');
      component.passwordControl.setValue('Password1');
      authService.login.mockReturnValue(throwError(() => ({ error: 'bad creds' })));

      component.onLoginClicked();

      expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'bad creds' }));
    });

    it('dispatches accountError when getUserInfo fails', () => {
      component.loginControl.setValue('user@mail.com');
      component.passwordControl.setValue('Password1');
      authService.login.mockReturnValue(of(undefined));
      authService.getUserInfo.mockReturnValue(throwError(() => ({ error: 'info failed' })));

      component.onLoginClicked();

      expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'info failed' }));
    });
  });

  it('navigates to register on registration clicked', async () => {
    fixture.detectChanges();
    await component.onRegistrationClicked();
    expect(router.navigate).toHaveBeenCalledWith(['register'], { relativeTo: expect.anything() });
  });

  it('shows the login error snackbar', () => {
    component.showLoginError('oops');
    expect(snackbar.open).toHaveBeenCalledWith('oops', undefined, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 3000
    });
  });

  describe('effect reacting to account store state', () => {
    it('does nothing while state is initial (id empty, no error)', () => {
      fixture.detectChanges();
      expect(component.isSuccess()).toBe(false);
    });

    it('ignores a store state that is not available yet', () => {
      fixture.detectChanges();
      component.isLoading.set(true);

      accountState$.next(undefined as unknown as IAccountState);
      fixture.detectChanges();

      expect(component.isSuccess()).toBe(false);
      expect(component.isLoading()).toBe(true);
      expect(snackbar.open).not.toHaveBeenCalled();
    });

    it('sets success, stops loading and navigates after delay on successful login', async () => {
      vi.useFakeTimers();
      fixture.detectChanges();
      component.isLoading.set(true);

      accountState$.next({ ...accountInitialState, id: '42' });
      fixture.detectChanges();

      expect(component.isSuccess()).toBe(true);
      expect(component.isLoading()).toBe(false);

      await vi.advanceTimersByTimeAsync(500);

      expect(router.navigate).toHaveBeenCalledWith(['hub']);
      expect(component.isSuccess()).toBe(false);
    });

    it('shows the error and stops loading when the store carries an error', () => {
      fixture.detectChanges();
      component.isLoading.set(true);

      accountState$.next({
        ...accountInitialState,
        error: { isError: true, errorMessage: 'wrong password' }
      });
      fixture.detectChanges();

      expect(snackbar.open).toHaveBeenCalledWith('wrong password', undefined, {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        duration: 3000
      });
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('template interactions', () => {
    const passwordInput = () =>
      fixture.nativeElement.querySelector('input[placeholder="Your very secure password"]') as HTMLInputElement;

    it('toggles password visibility on suffix icon click', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement;
      expect(component.isPasswordHidden()).toBe(false);
      expect(passwordInput().type).toBe('password');

      button.click();
      fixture.detectChanges();

      expect(component.isPasswordHidden()).toBe(true);
      expect(passwordInput().type).toBe('text');
    });

    it('shows the spinner while loading and the success icon once successful', () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();

      component.isLoading.set(false);
      component.isSuccess.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('mat-icon[style*="forestgreen"]')).toBeTruthy();
    });

    it('renders field errors while invalid and clears them for valid input', () => {
      component.loginControl.markAsTouched();
      component.passwordControl.markAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('This field is required to log in :P');
      expect(fixture.nativeElement.textContent).toContain('This field can not be empty');

      component.loginControl.setValue('user@mail.com');
      component.passwordControl.setValue('Password1');
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('This field is required to log in :P');
      expect(fixture.nativeElement.textContent).not.toContain('This field can not be empty');
    });

    it('submits with the login button and starts registration with the sign-up button', async () => {
      authService.login.mockReturnValue(of(undefined));
      authService.getUserInfo.mockReturnValue(of({ id: '1' } as unknown as UserResponse));
      fixture.detectChanges();
      component.loginControl.setValue('user@mail.com');
      component.passwordControl.setValue('Password1');
      fixture.detectChanges();

      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
      const loginButton = buttons.find(button => button.textContent?.includes('Login'))!;
      loginButton.click();

      expect(authService.login).toHaveBeenCalledWith('user@mail.com', 'Password1');

      const signUpButton = buttons.find(button => button.textContent?.includes('Sign up'))!;
      signUpButton.click();
      await fixture.whenStable();

      expect(router.navigate).toHaveBeenCalledWith(['register'], { relativeTo: expect.anything() });
    });
  });
});
