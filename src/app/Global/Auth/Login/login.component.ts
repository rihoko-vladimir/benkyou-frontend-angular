import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
export class LoginComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private store = inject<Store<AppState>>(Store);
  private snackbar = inject(MatSnackBar);

  loginControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  isPasswordHidden = signal(false);
  // Zoneless-safe state: flags written from async callbacks must be
  // signals so CD is scheduled when they change (OnPush + zoneless).
  isLoading = signal(false);
  isSuccess = signal(false);
  private accountState = toSignal(this.store.select(selectAccount), { initialValue: null });

  constructor() {
    effect(() => {
      const value = this.accountState();
      if (!value) return;

      if (!value?.error?.isError && value.id !== '') {
        this.isSuccess.set(true);
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['hub']);
          this.isSuccess.set(false);
        }, 500);
      } else if (value?.error?.isError) {
        this.showLoginError(value.error.errorMessage);
        this.isLoading.set(false);
      }
    });
  }

  onLoginClicked() {
    if (this.loginControl.valid && this.passwordControl.valid) {
      this.isLoading.set(true);
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

  showLoginError(errorMessage: string) {
    this.snackbar.open(errorMessage, undefined, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }
}
