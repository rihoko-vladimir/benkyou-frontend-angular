import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { Store } from '@ngrx/store';
import AppState from '../../../Redux/app.state';
import { selectAccount } from '../../../Redux/Selectors/selectors';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { accountError, accountInfoSuccess } from '../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../Services/Helpers/converters';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private store = inject<Store<AppState>>(Store);
  private snackbar = inject(MatSnackBar);

  loginControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  subscription;
  isPasswordHidden = false;
  isLoading = false;
  isSuccess = false;

  constructor() {
    const router = this.router;
    const store = this.store;

    this.subscription = store.select(selectAccount).subscribe(value => {
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
      this.authService.login(this.loginControl.value!, this.passwordControl.value!).subscribe({
        next: () => this.loadUserInfo(),
        error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
      });
    } else {
      this.loginControl.markAsTouched();
      this.passwordControl.markAsTouched();
    }
  }

  private loadUserInfo() {
    this.authService.getUserInfo().subscribe({
      next: userInfo => this.store.dispatch(accountInfoSuccess(mapUserResponseToAccountState(userInfo))),
      error: error => this.store.dispatch(accountError({ errorMessage: error.error }))
    });
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
