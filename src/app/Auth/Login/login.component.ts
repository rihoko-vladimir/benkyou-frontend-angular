import {Component} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";

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

  onLoginClicked(){
    console.log(`login clicked!, user typed: ${this.loginControl.value}, ${this.passwordControl.value}`)
  }

  onRegistrationClicked(){
    console.log(`registration clicked!`)
  }

  getEmailErrorMessage() {
    if (this.loginControl.hasError("email")){
      return "Incorrect email provided"
    }
    return "This field is required to log in :P"
  }

  getPasswordErrorMessage() {
    if (this.passwordControl.hasError("pattern")){
      return "Password must contain one uppercase character, one digit and be at least 8 characters long"
    }
    return "This field can not be empty"
  }
}
