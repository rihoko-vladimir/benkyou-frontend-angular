import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../../../Services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'password-reset',
  templateUrl: 'password-reset.component.html',
  styleUrls: ['password-reset.component.scss']
})
export class PasswordResetComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  isLoading: boolean = false;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

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
      this.authService
        .resetPassword(this.emailControl.value!)
        .pipe(
          catchError(error => {
            this.isLoading = false;
            this.snackbar.open(error.error, undefined, {
              horizontalPosition: 'start',
              verticalPosition: 'bottom',
              duration: 3000
            });
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.stepper.next();
          this.isLoading = false;
        });
    } else {
      this.emailControl.markAsTouched();
    }
  }

  async onFinishClicked() {
    await this.router.navigate(['auth']);
  }
}
