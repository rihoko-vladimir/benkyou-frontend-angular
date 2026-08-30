import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { AuthService } from '../../../Services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { NgIf, NgClass } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'password-reset',
  templateUrl: 'password-reset.component.html',
  styleUrls: ['password-reset.component.scss'],
  imports: [
    MatStepper,
    MatStep,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatError,
    MatButton,
    NgClass,
    MatSnackBarModule
  ]
})
export class PasswordResetComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackbar = inject(MatSnackBar);

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  isLoading: boolean = false;

  @ViewChild('stepper') stepper!: MatStepper;

  getEmailErrorMessage() {
    if (this.emailControl.hasError(Validators.required.name)) return 'This field is required to continue :P';

    if (this.emailControl.hasError(Validators.email.name)) return 'Incorrect email address provided';

    return 'Unknown error occurred';
  }

  async onCancelClicked() {
    await this.router.navigate(['auth']);
  }

  onNextClicked() {
    if (this.emailControl.valid) {
      this.isLoading = true;
      this.authService.resetPassword(this.emailControl.value!).subscribe({
        next: () => {
          this.stepper.next();
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.snackbar.open(error.error, undefined, {
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
            duration: 3000
          });
        }
      });
    } else {
      this.emailControl.markAsTouched();
    }
  }

  async onFinishClicked() {
    await this.router.navigate(['auth']);
  }
}
