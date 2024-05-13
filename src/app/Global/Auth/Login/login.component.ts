import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { Store } from '@ngrx/store';
import AppState from '../../../Redux/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnDestroy, OnInit {
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

  ngOnInit() {
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable()
      ]).then(results => {
        if (results.every(r => r === true)) {
          this.isPasskeyAvailable = true;
        }
      });
    }
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
    console.log("i'm destroyed");
  }

  showLoginError(errorMessage: string) {
    this.snackbar.open(errorMessage, undefined, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }

  onPasskeyLoginClicked() {}
}
