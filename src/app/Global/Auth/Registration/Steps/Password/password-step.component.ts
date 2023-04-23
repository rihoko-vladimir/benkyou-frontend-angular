import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordConfirmationEqualityValidator} from "../../../PasswordReset/validators/password-confirmation-equality";

//Password must contain one uppercase char, one digit and be at least 8 chars long
const regExpr = `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`;

@Component({
  templateUrl: "password-step.component.html",
  styleUrls: ["password-step.component.css"],
  selector: "password-step"
})

export class PasswordStepComponent{
  passwordFormGroup = new FormGroup({
    passwordControl: new FormControl("",
      [
        Validators.required,
        Validators.pattern(regExpr)
      ]),
    passwordConfirmationControl: new FormControl("",
      [
        Validators.required
      ])
  }, [PasswordConfirmationEqualityValidator("passwordControl", "passwordConfirmationControl")])

  getPasswordErrorMessage() {
    if (this.passwordFormGroup.controls.passwordControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.passwordFormGroup.controls.passwordControl
      .hasError(Validators.pattern.name))
      return "Password must contain one uppercase character, one digit and be at least 8 characters long"

    return "Unknown error occurred :("
  }

  getPasswordConfirmationErrorMessage() {
    if (this.passwordFormGroup.controls.passwordConfirmationControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.passwordFormGroup.controls.passwordConfirmationControl
      .hasError(PasswordConfirmationEqualityValidator.name))
      return "Password confirmation must be the same as password"

    return "Unknown error occurred :("
  }

}
