import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordConfirmationEqualityValidator } from '../PasswordReset/validators/password-confirmation-equality';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

//Password must contain one uppercase char, one digit and be at least 8 chars long
const regExpr = `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`;

@Component({
  selector: 'new-password',
  templateUrl: 'new-password.component.html',
  styleUrls: ['new-password.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton, MatSnackBarModule]
})
export class NewPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  isLoading: boolean = false;
  token: string = '';
  email: string = '';
  passwordGroup = new FormGroup(
    {
      passwordControl: new FormControl('', [Validators.required, Validators.pattern(regExpr)]),
      confirmationControl: new FormControl('', [Validators.required])
    },
    [PasswordConfirmationEqualityValidator('passwordControl', 'confirmationControl')]
  );

  getPasswordErrorMessage() {
    if (this.passwordGroup.controls.passwordControl.hasError(Validators.required.name)) return 'This field is required';
    if (this.passwordGroup.controls.passwordControl.hasError(Validators.pattern.name))
      return 'Password must contain one uppercase character, one digit and be at least 8 characters long';

    return 'Unknown error occurred :(';
  }

  getPasswordConfirmationErrorMessage() {
    if (this.passwordGroup.controls.confirmationControl.hasError(Validators.required.name))
      return 'This field is required';
    if (this.passwordGroup.controls.confirmationControl.hasError(PasswordConfirmationEqualityValidator.name))
      return 'Password confirmation must be the same as password';

    return 'Unknown error occurred :(';
  }

  onSetNewPasswordClicked() {
    if (this.passwordGroup.valid) {
      this.isLoading = true;
      this.authService
        .setNewPassword(this.passwordGroup.controls.confirmationControl.value!, this.email, this.token)
        .subscribe({
          next: () => {
            this.router.navigate(['auth']);
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
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }
}
