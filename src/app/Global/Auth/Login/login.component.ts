import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { Store } from '@ngrx/store';
import AppState from '../../../Redux/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { accountError, loginSuccess } from '../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../Services/Helpers/converters';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  subscription;
  isPasswordHidden = false;
  isLoading = false;
  isSuccess = false;
  isPasskeyAvailable = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<AppState>,
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
      next: userInfo => this.store.dispatch(loginSuccess(mapUserResponseToAccountState(userInfo))),
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

  onPasskeyLoginClicked() {
    this.authService.getAssertionOptions().subscribe(async options => {
      const challenge = options.challenge.replace(/-/g, '+').replace(/_/g, '/');
      options.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.allowCredentials.forEach((listItem: { id: any }) => {
        const fixedId = listItem.id.replace(/_/g, '/').replace(/-/g, '+');
        listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
      });

      await navigator.credentials.get({ publicKey: options });
    });
  }
}
