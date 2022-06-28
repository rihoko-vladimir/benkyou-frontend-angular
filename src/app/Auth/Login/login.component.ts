import {Component} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

//Password must contain one uppercase char, one digit and be at least 8 chars long
const regExpr = `^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\\d).*$`;

@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})

export class LoginComponent{
  loginControl = new FormControl("",
    [Validators.required, Validators.email])
  passwordControl = new FormControl("",
    [Validators.required, Validators.pattern(regExpr)])

  isPasswordHidden = false

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  onLoginClicked(){
    if (this.loginControl.valid && this.passwordControl.valid) console.log(`login clicked!, user typed: ${this.loginControl.value}, ${this.passwordControl.value}`)
    else {
      this.loginControl.markAsTouched()
      this.passwordControl.markAsTouched()
    }
  }

  async onRegistrationClicked(){
    await this.router.navigate(["register"], {relativeTo: this.route})
  }

  getEmailErrorMessage() : string {
    if (this.loginControl.hasError(Validators.email.name)) return "Incorrect email provided"

    if (this.loginControl.hasError(Validators.required.name)) return "This field is required to log in :P"

    return "An Unknown error have occurred";
  }

  getPasswordErrorMessage() : string {
    if (this.passwordControl.hasError(Validators.pattern.name)) return "Password must contain one uppercase character, one digit and be at least 8 characters long"

    if (this.passwordControl.hasError(Validators.required.name)) return "This field can not be empty"

    return "An Unknown error have occurred";
  }
}
