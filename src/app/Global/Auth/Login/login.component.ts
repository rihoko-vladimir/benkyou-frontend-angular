import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { Store } from '@ngrx/store';
import AppState from '../../../Redux/app.state';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinner,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatIconButton,
    MatSuffix,
    RouterLink,
    MatButton,
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnDestroy {
  loginControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  subscription;
  isPasswordHidden = false;
  isLoading = false;
  isSuccess = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    store: Store<AppState>,
    private snackbar: MatSnackBar
  ) {
    this.subscription = store.select('account').subscribe(value => {
      if (!value?.error?.isError && value.id !== '') {
        this.isSuccess = true;
        this.isLoading = false;
        setTimeout(() => {
          router.navigate(['hub']);
          this.isSuccess = false;
        }, 500);
      } else if (value?.error?.isError) {
        this.showLoginError(value.error.errorMessage);
        this.isLoading = false;
      }
    });
  }

  onLoginClicked() {
    if (this.loginControl.valid && this.passwordControl.valid) {
      this.isLoading = true;
      this.authService.login(this.loginControl.value!, this.passwordControl.value!);
    } else {
      this.loginControl.markAsTouched();
      this.passwordControl.markAsTouched();
    }
  }

  async onRegistrationClicked() {
    await this.router.navigate(['register'], { relativeTo: this.route });
  }

  getEmailErrorMessage(): string {
    if (this.loginControl.hasError(Validators.email.name)) return 'Incorrect email provided';

    if (this.loginControl.hasError(Validators.required.name)) return 'This field is required to log in :P';

    return 'An Unknown error have occurred';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError(Validators.required.name)) return 'This field can not be empty';

    return 'An Unknown error have occurred';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showLoginError(errorMessage: string) {
    this.snackbar.open(errorMessage, undefined, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }
}
