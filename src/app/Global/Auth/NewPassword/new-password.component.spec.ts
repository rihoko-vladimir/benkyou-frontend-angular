import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { NewPasswordComponent } from './new-password.component';
import { AuthService } from '../../../Services/auth.service';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;
  let authService: { setNewPassword: ReturnType<typeof vi.fn> };
  let snackbar: MatSnackBar;
  let router: Router;
  let queryParams$: BehaviorSubject<Record<string, string>>;

  beforeEach(() => {
    authService = { setNewPassword: vi.fn() };
    queryParams$ = new BehaviorSubject<Record<string, string>>({ token: 'abc', email: 'user@mail.com' });

    TestBed.configureTestingModule({
      imports: [NewPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$ } }
      ]
    });

    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    // The component imports MatSnackBarModule, which provides MatSnackBar in
    // its own injector and shadows a testing-module override, so spy on the
    // instance the component actually injects.
    snackbar = fixture.debugElement.injector.get(MatSnackBar);
    vi.spyOn(snackbar, 'open');
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit query params', () => {
    it('reads token and email from query params', () => {
      fixture.detectChanges();
      expect(component.token()).toBe('abc');
      expect(component.email()).toBe('user@mail.com');
    });

    it('defaults to empty strings when params are missing', () => {
      queryParams$.next({});
      fixture.detectChanges();
      expect(component.token()).toBe('');
      expect(component.email()).toBe('');
    });
  });

  describe('error message getters', () => {
    it('password: required', () => {
      component.passwordGroup.controls.passwordControl.setValue('');
      expect(component.getPasswordErrorMessage()).toBe('This field is required');
    });
    it('password: pattern', () => {
      component.passwordGroup.controls.passwordControl.setValue('weak');
      expect(component.getPasswordErrorMessage()).toBe(
        'Password must contain one uppercase character, one digit and be at least 8 characters long'
      );
    });
    it('password: unknown', () => {
      component.passwordGroup.controls.passwordControl.setValue('Password1');
      component.passwordGroup.controls.passwordControl.setErrors({ other: true });
      expect(component.getPasswordErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('confirmation: required', () => {
      component.passwordGroup.controls.confirmationControl.setValue('');
      component.passwordGroup.controls.confirmationControl.setErrors({ required: true });
      expect(component.getPasswordConfirmationErrorMessage()).toBe('This field is required');
    });
    it('confirmation: mismatch', () => {
      component.passwordGroup.setValue({ passwordControl: 'Password1', confirmationControl: 'Different1' });
      expect(component.getPasswordConfirmationErrorMessage()).toBe(
        'Password confirmation must be the same as password'
      );
    });
    it('confirmation: unknown', () => {
      component.passwordGroup.controls.confirmationControl.setValue('Password1');
      component.passwordGroup.controls.confirmationControl.setErrors({ other: true });
      expect(component.getPasswordConfirmationErrorMessage()).toBe('Unknown error occurred :(');
    });
  });

  describe('onSetNewPasswordClicked', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.passwordGroup.setValue({ passwordControl: 'Password1', confirmationControl: 'Password1' });
    });

    it('does nothing when the form is invalid', () => {
      component.passwordGroup.setValue({ passwordControl: '', confirmationControl: '' });
      component.onSetNewPasswordClicked();
      expect(authService.setNewPassword).not.toHaveBeenCalled();
    });

    it('sets new password and navigates on success', () => {
      authService.setNewPassword.mockReturnValue(of(undefined));

      component.onSetNewPasswordClicked();

      expect(authService.setNewPassword).toHaveBeenCalledWith('Password1', 'user@mail.com', 'abc');
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });

    it('shows an error snackbar and stops loading on failure', () => {
      authService.setNewPassword.mockReturnValue(throwError(() => ({ error: 'reset failed' })));

      component.onSetNewPasswordClicked();

      expect(component.isLoading()).toBe(false);
      expect(snackbar.open).toHaveBeenCalledWith('reset failed', undefined, {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        duration: 3000
      });
    });
  });

  it('submits the form through the finish button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    component.passwordGroup.setValue({ passwordControl: 'Password1', confirmationControl: 'Password1' });
    fixture.detectChanges();
    expect(button.disabled).toBe(false);

    authService.setNewPassword.mockReturnValue(of(undefined));
    button.click();

    expect(authService.setNewPassword).toHaveBeenCalledWith('Password1', 'user@mail.com', 'abc');
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });
});
