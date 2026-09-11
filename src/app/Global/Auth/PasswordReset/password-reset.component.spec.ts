import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../../Services/auth.service';
import { MatStepper } from '@angular/material/stepper';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authService: { resetPassword: ReturnType<typeof vi.fn> };
  let snackbar: MatSnackBar;
  let router: Router;

  beforeEach(() => {
    authService = { resetPassword: vi.fn() };

    TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }]
    });

    fixture = TestBed.createComponent(PasswordResetComponent);
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

  describe('getEmailErrorMessage', () => {
    it('required', () => {
      component.emailControl.setValue('');
      expect(component.getEmailErrorMessage()).toBe('This field is required to continue :P');
    });
    it('invalid format', () => {
      component.emailControl.setValue('not-an-email');
      expect(component.getEmailErrorMessage()).toBe('Incorrect email address provided');
    });
    it('unknown', () => {
      component.emailControl.setValue('a@b.com');
      component.emailControl.setErrors({ other: true });
      expect(component.getEmailErrorMessage()).toBe('Unknown error occurred');
    });
  });

  it('onCancelClicked navigates to auth', async () => {
    await component.onCancelClicked();
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });

  it('onFinishClicked navigates to auth', async () => {
    await component.onFinishClicked();
    expect(router.navigate).toHaveBeenCalledWith(['auth']);
  });

  describe('onNextClicked', () => {
    it('marks the control as touched when invalid', () => {
      component.emailControl.setValue('');
      component.onNextClicked();
      expect(component.emailControl.touched).toBe(true);
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });

    it('advances the stepper on success', () => {
      component.emailControl.setValue('user@mail.com');
      authService.resetPassword.mockReturnValue(of(undefined));
      component.stepper = { next: vi.fn() } as unknown as MatStepper;

      component.onNextClicked();

      expect(authService.resetPassword).toHaveBeenCalledWith('user@mail.com');
      expect(component.stepper.next).toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });

    it('shows an error snackbar and stops loading on failure', () => {
      component.emailControl.setValue('user@mail.com');
      authService.resetPassword.mockReturnValue(throwError(() => ({ error: 'reset failed' })));
      component.stepper = { next: vi.fn() } as unknown as MatStepper;

      component.onNextClicked();

      expect(component.isLoading()).toBe(false);
      expect(snackbar.open).toHaveBeenCalledWith('reset failed', undefined, {
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        duration: 3000
      });
    });
  });

  describe('template interactions', () => {
    const actionButtons = () => Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

    it('renders the email error only while the address is invalid', () => {
      component.emailControl.markAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('This field is required to continue :P');

      component.emailControl.setValue('user@mail.com');
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('This field is required to continue :P');
    });

    it('moves to the sent confirmation step and finishes with the buttons', () => {
      component.emailControl.setValue('user@mail.com');
      authService.resetPassword.mockReturnValue(of(undefined));
      fixture.detectChanges();

      const [, mainButton] = actionButtons();
      expect(mainButton.textContent).toContain('Next');

      mainButton.click();
      fixture.detectChanges();

      expect(component.stepper.selectedIndex).toBe(1);
      expect(mainButton.textContent).toContain('Finish');

      mainButton.click();

      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });

    it('navigates to auth with the cancel button', () => {
      fixture.detectChanges();

      const [cancelButton] = actionButtons();
      cancelButton.click();

      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
  });
});
