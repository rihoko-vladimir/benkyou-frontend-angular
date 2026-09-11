import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodeInputComponent } from 'angular-code-input';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Validators } from '@angular/forms';
import { RegistrationComponent } from './registration.component';
import { AuthService } from '../../../Services/auth.service';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let authService: {
    register: ReturnType<typeof vi.fn>;
    confirmEmailAddress: ReturnType<typeof vi.fn>;
  };
  let snackbar: MatSnackBar;
  let router: Router;

  beforeEach(() => {
    authService = { register: vi.fn(), confirmEmailAddress: vi.fn() };

    TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        // main.ts provides these options, the custom matStepperIcon states depend on them.
        { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } }
      ]
    });

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    // The component imports MatSnackBarModule, which provides MatSnackBar in
    // its own injector and shadows a testing-module override, so spy on the
    // instance the component actually injects.
    snackbar = fixture.debugElement.injector.get(MatSnackBar);
    vi.spyOn(snackbar, 'open');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  const fillCredentials = () => {
    component.credentialsFormGroup.setValue({
      userNameControl: 'user1',
      emailControl: 'user@mail.com',
      firstNameControl: 'John',
      lastNameControl: 'Smith'
    });
  };

  const fillPassword = (password = 'Password1', confirmation = 'Password1') => {
    component.passwordFormGroup.setValue({
      passwordControl: password,
      passwordConfirmationControl: confirmation
    });
  };

  describe('onNextClicked - step 0 (credentials)', () => {
    it('marks all as touched when invalid', () => {
      component.stepper.selectedIndex = 0;
      component.onNextClicked();
      expect(component.credentialsFormGroup.controls.userNameControl.touched).toBe(true);
    });

    it('advances stepper when valid', () => {
      component.stepper.selectedIndex = 0;
      fillCredentials();
      const nextSpy = vi.spyOn(component.stepper, 'next');
      component.onNextClicked();
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe('onNextClicked - step 1 (password)', () => {
    it('marks all as touched when invalid', () => {
      component.stepper.selectedIndex = 1;
      component.onNextClicked();
      expect(component.passwordFormGroup.controls.passwordControl.touched).toBe(true);
    });

    it('advances stepper when valid', () => {
      component.stepper.selectedIndex = 1;
      fillPassword();
      const nextSpy = vi.spyOn(component.stepper, 'next');
      component.onNextClicked();
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe('onNextClicked - step 2 (registration submit)', () => {
    beforeEach(() => {
      fillCredentials();
      fillPassword();
      // The linear stepper ignores direct selectedIndex jumps past uninteracted
      // steps, so walk there the same way the UI does.
      component.stepper.next();
      component.stepper.next();
    });

    it('registers successfully, sets userId, hides buttons and advances stepper', () => {
      authService.register.mockReturnValue(of('user-id-123'));
      const nextSpy = vi.spyOn(component.stepper, 'next');

      component.onNextClicked();

      expect(authService.register).toHaveBeenCalledWith('user1', 'user@mail.com', 'John', 'Smith', 'Password1');
      expect(component.userId()).toBe('user-id-123');
      expect(component.areButtonsHidden()).toBe(true);
      expect(nextSpy).toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });

    it('shows an error snackbar on register failure', () => {
      authService.register.mockReturnValue(throwError(() => ({ error: 'email taken' })));

      component.onNextClicked();

      expect(snackbar.open).toHaveBeenCalledWith('email taken', undefined, {
        verticalPosition: 'bottom',
        horizontalPosition: 'start',
        duration: 2000
      });
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onPreviousClicked', () => {
    it('navigates to auth when at the first step', async () => {
      component.stepper.selectedIndex = 0;
      await component.onPreviousClicked();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });

    it('goes to the previous step otherwise', async () => {
      component.stepper.selectedIndex = 1;
      const previousSpy = vi.spyOn(component.stepper, 'previous');
      await component.onPreviousClicked();
      expect(previousSpy).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('error message getters', () => {
    it('userName: required', () => {
      component.credentialsFormGroup.controls.userNameControl.setValue('');
      expect(component.getUserNameErrorMessage()).toBe('This field is required');
    });
    it('userName: minlength', () => {
      component.credentialsFormGroup.controls.userNameControl.setValue('ab');
      expect(component.getUserNameErrorMessage()).toBe('Username must be at least 4 chars long');
    });
    it('userName: maxlength', () => {
      component.credentialsFormGroup.controls.userNameControl.setValue('a'.repeat(20));
      expect(component.getUserNameErrorMessage()).toBe('Username must not be longer than 10 chars');
    });
    it('userName: unknown', () => {
      component.credentialsFormGroup.controls.userNameControl.setValue('valid');
      component.credentialsFormGroup.controls.userNameControl.setErrors({ other: true });
      expect(component.getUserNameErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('email: required', () => {
      component.credentialsFormGroup.controls.emailControl.setValue('');
      expect(component.getEmailErrorMessage()).toBe('This field is required');
    });
    it('email: invalid format', () => {
      component.credentialsFormGroup.controls.emailControl.setValue('not-email');
      expect(component.getEmailErrorMessage()).toBe('Incorrect email address provided');
    });
    it('email: unknown', () => {
      component.credentialsFormGroup.controls.emailControl.setValue('a@b.com');
      component.credentialsFormGroup.controls.emailControl.setErrors({ other: true });
      expect(component.getEmailErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('firstName: required', () => {
      component.credentialsFormGroup.controls.firstNameControl.setValue('');
      expect(component.getFirstNameErrorMessage()).toBe('This field is required');
    });
    it('firstName: maxlength', () => {
      component.credentialsFormGroup.controls.firstNameControl.setValue('a'.repeat(25));
      expect(component.getFirstNameErrorMessage()).toBe('First name must not be longer than 20 chars');
    });
    it('firstName: unknown', () => {
      component.credentialsFormGroup.controls.firstNameControl.setValue('John');
      component.credentialsFormGroup.controls.firstNameControl.setErrors({ other: true });
      expect(component.getFirstNameErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('lastName: required', () => {
      component.credentialsFormGroup.controls.lastNameControl.setValue('');
      expect(component.getLastNameErrorMessage()).toBe('This field is required');
    });
    it('lastName: maxlength', () => {
      component.credentialsFormGroup.controls.lastNameControl.setValue('a'.repeat(40));
      expect(component.getLastNameErrorMessage()).toBe('Last name must not be longer than 35 chars');
    });
    it('lastName: unknown', () => {
      component.credentialsFormGroup.controls.lastNameControl.setValue('Smith');
      component.credentialsFormGroup.controls.lastNameControl.setErrors({ other: true });
      expect(component.getLastNameErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('password: required', () => {
      component.passwordFormGroup.controls.passwordControl.setValue('');
      expect(component.getPasswordErrorMessage()).toBe('This field is required');
    });
    it('password: pattern', () => {
      component.passwordFormGroup.controls.passwordControl.setValue('weak');
      expect(component.getPasswordErrorMessage()).toBe(
        'Password must contain one uppercase character, one digit and be at least 8 characters long'
      );
    });
    it('password: unknown', () => {
      component.passwordFormGroup.controls.passwordControl.setValue('Password1');
      component.passwordFormGroup.controls.passwordControl.setErrors({ other: true });
      expect(component.getPasswordErrorMessage()).toBe('Unknown error occurred :(');
    });

    it('passwordConfirmation: required', () => {
      component.passwordFormGroup.controls.passwordConfirmationControl.setValue('');
      component.passwordFormGroup.controls.passwordConfirmationControl.setErrors({
        [Validators.required.name]: true
      });
      expect(component.getPasswordConfirmationErrorMessage()).toBe('This field is required');
    });
    it('passwordConfirmation: mismatch', () => {
      fillPassword('Password1', 'Different1');
      expect(component.getPasswordConfirmationErrorMessage()).toBe(
        'Password confirmation must be the same as password'
      );
    });
    it('passwordConfirmation: unknown', () => {
      component.passwordFormGroup.controls.passwordConfirmationControl.setValue('Password1');
      component.passwordFormGroup.controls.passwordConfirmationControl.setErrors({ other: true });
      expect(component.getPasswordConfirmationErrorMessage()).toBe('Unknown error occurred :(');
    });
  });

  describe('onSendConfirmationCode', () => {
    beforeEach(() => {
      component.confirmationCodeElement = { disabled: false } as unknown as CodeInputComponent;
      component.userId.set('user-id-123');
    });

    it('disables the code input and confirms successfully', () => {
      authService.confirmEmailAddress.mockReturnValue(of('confirmed-id'));

      component.onSendConfirmationCode('123456');

      expect(component.confirmationCodeElement.disabled).toBe(true);
      expect(authService.confirmEmailAddress).toHaveBeenCalledWith('user-id-123', '123456');
      expect(component.userId()).toBe('confirmed-id');
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });

    it('shows an error snackbar on confirmation failure', () => {
      authService.confirmEmailAddress.mockReturnValue(throwError(() => ({ error: 'bad code' })));

      component.onSendConfirmationCode('000000');

      expect(snackbar.open).toHaveBeenCalledWith('bad code', undefined, {
        verticalPosition: 'bottom',
        horizontalPosition: 'start',
        duration: 2000
      });
    });
  });

  it('hideButtons sets areButtonsHidden to true', () => {
    component.hideButtons();
    expect(component.areButtonsHidden()).toBe(true);
  });

  describe('template interactions', () => {
    const buttons = () => Array.from(fixture.nativeElement.querySelectorAll('.buttons button')) as HTMLButtonElement[];

    it('renders required errors for invalid credentials and clears them when valid', () => {
      component.credentialsFormGroup.markAllAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('This field is required');

      fillCredentials();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('This field is required');
    });

    it('walks through the steps with the action buttons and shows the spinner while loading', () => {
      fillCredentials();
      fixture.detectChanges();
      expect(buttons()[0].textContent).toContain('Cancel');
      expect(buttons()[1].textContent).toContain('Next');

      buttons()[1].click();
      fixture.detectChanges();
      expect(component.stepper.selectedIndex).toBe(1);
      expect(buttons()[0].textContent).toContain('Back');

      fillPassword();
      buttons()[1].click();
      fixture.detectChanges();
      expect(component.stepper.selectedIndex).toBe(2);
      expect(buttons()[1].textContent).toContain('Finish');

      component.isLoading.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();

      component.isLoading.set(false);
      fixture.detectChanges();
      buttons()[0].click();
      fixture.detectChanges();
      expect(component.stepper.selectedIndex).toBe(1);
    });

    it('navigates back to auth from the first step', () => {
      fixture.detectChanges();

      buttons()[0].click();

      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });

    it('hides the action buttons once the registration completes', () => {
      component.hideButtons();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.buttons')).toBeNull();
    });

    it('renders the step icons when navigating back through completed steps', () => {
      fillCredentials();
      fillPassword();
      component.stepper.next();
      component.stepper.next();
      fixture.detectChanges();

      const headers = Array.from(fixture.nativeElement.querySelectorAll('mat-step-header')) as HTMLElement[];

      headers[0].click();
      fixture.detectChanges();
      expect(headers[0].textContent).toContain('person');

      headers[1].click();
      fixture.detectChanges();
      expect(headers[1].textContent).toContain('key');

      headers[2].click();
      fixture.detectChanges();
      expect(headers[2].textContent).toContain('done');
      expect(headers[2].textContent).not.toContain('confirmation');
    });

    it('renders the terms icon override', () => {
      // No step uses the terms state, so point one at it to check the override resolves.
      component.stepper.steps.get(2)!.state = 'terms';
      fixture.detectChanges();

      const headers = Array.from(fixture.nativeElement.querySelectorAll('mat-step-header')) as HTMLElement[];
      expect(headers[2].textContent).toContain('article');
      expect(headers[2].textContent).not.toContain('done');
    });

    it('hides the password errors when their controls are missing', () => {
      component.credentialsFormGroup.markAllAsTouched();
      component.passwordFormGroup.markAllAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBe(6);

      // The password errors are guarded on control presence; drop the controls to exercise that.
      component.passwordFormGroup.controls.passwordControl = null as never;
      component.passwordFormGroup.controls.passwordConfirmationControl = null as never;
      component.stepper.next();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBe(4);
    });

    it('handles the confirmation code emitted by the code input', () => {
      fixture.detectChanges();
      const codeInput = fixture.debugElement.query(By.directive(CodeInputComponent))
        .componentInstance as CodeInputComponent;
      component.userId.set('user-id-123');
      authService.confirmEmailAddress.mockReturnValue(of('confirmed-id'));

      codeInput.codeCompleted.emit('123456');

      expect(authService.confirmEmailAddress).toHaveBeenCalledWith('user-id-123', '123456');
      expect(component.userId()).toBe('confirmed-id');
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
});
