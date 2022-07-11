import {Component, OnDestroy} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../Services/auth.service";
import {Store} from "@ngrx/store";
import AppState from "../../../Redux/app.state";

@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})

export class LoginComponent implements OnDestroy {
  loginControl = new FormControl("",
    [Validators.required, Validators.email])
  passwordControl = new FormControl("",
    [Validators.required])
  subscription

  isPasswordHidden = false

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private store: Store<AppState>) {
    this.subscription = store.select("account").subscribe(value => {
        if (value.id != "") {
          router.navigate(["hub"])
        }
      }
    )
  }

  onLoginClicked() {
    if (this.loginControl.valid && this.passwordControl.valid) {
      this.authService.login(this.loginControl.value!, this.passwordControl.value!)
    } else {
      this.loginControl.markAsTouched()
      this.passwordControl.markAsTouched()
    }
  }

  async onRegistrationClicked() {
    await this.router.navigate(["register"], {relativeTo: this.route})
  }

  getEmailErrorMessage(): string {
    if (this.loginControl.hasError(Validators.email.name)) return "Incorrect email provided"

    if (this.loginControl.hasError(Validators.required.name)) return "This field is required to log in :P"

    return "An Unknown error have occurred";
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError(Validators.required.name)) return "This field can not be empty"

    return "An Unknown error have occurred";
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
