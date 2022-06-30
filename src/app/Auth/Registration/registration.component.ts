import {Component, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {Router} from "@angular/router";
import {PasswordConfirmationEqualityValidator} from "../PasswordReset/validators/password-confirmation-equality";
import {CodeInputComponent} from "angular-code-input";


//Password must contain one uppercase char, one digit and be at least 8 chars long
const regExpr = `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`;

@Component({
  selector: "registration",
  templateUrl: "registration.component.html",
  styleUrls: ["registration.component.css"],
  animations: []
})

export class RegistrationComponent {
  isUserAgreed : boolean
  isCheckboxError : boolean
  isButtonsHidden: boolean
  constructor(private router: Router) {
    this.isUserAgreed = false
    this.isCheckboxError = false
    this.isButtonsHidden = false
  }

  @ViewChild("stepper") stepper!: MatStepper;
  @ViewChild("confirmationCode") confirmationCodeElement!: CodeInputComponent;
  credentialsFormGroup = new FormGroup({
    userNameControl: new FormControl("",
      [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(4)
      ]),
    emailControl: new FormControl("",
      [
        Validators.required,
        Validators.email
      ]),
    firstNameControl: new FormControl("",
      [
        Validators.required,
        Validators.maxLength(20),
      ]),
    lastNameControl: new FormControl("",
      [
        Validators.required,
        Validators.maxLength(35)
      ])
  })
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
  formGroups = [this.credentialsFormGroup, this.passwordFormGroup]

  onNextClicked() {
    switch(this.stepper.selectedIndex){
      case 0:{
        if (this.credentialsFormGroup.valid)
          this.stepper.next()
        else
          this.credentialsFormGroup.markAllAsTouched()
        break
    }
      case 1:{
        if (this.passwordFormGroup.valid)
          this.stepper.next()
        else
          this.passwordFormGroup.markAllAsTouched()
        break
      }
      case 2:{
        if (this.isUserAgreed){
          //TODO send registration post request and after response next step
          this.hideButtons()
          this.stepper.next()
        }else{
          this.isCheckboxError = true
        }
        break
      }
      case 3:{

      }
    }
  }

  async onPreviousClicked() {
    if (this.stepper.selectedIndex == 0) {
      await this.router.navigate(["auth"])
      return
    }
    this.stepper.previous()
  }

  getUserNameErrorMessage(){
    if (this.credentialsFormGroup.controls.userNameControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.userNameControl
      .hasError("minlength"))
      return "Username must be at least 4 chars long"
    if (this.credentialsFormGroup.controls.userNameControl
      .hasError("maxlength"))
      return "Username must not be longer than 10 chars"
    return "Unknown error occurred :("
  }

  getEmailErrorMessage(){
    if (this.credentialsFormGroup.controls.emailControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.emailControl
      .hasError(Validators.email.name))
      return "Incorrect email address provided"
    return "Unknown error occurred :("
  }

  getFirstNameErrorMessage(){
    if (this.credentialsFormGroup.controls.firstNameControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.firstNameControl
      .hasError("maxlength"))
      return "First name must not be longer than 20 chars"

    return "Unknown error occurred :("
  }

  getLastNameErrorMessage(){
    if (this.credentialsFormGroup.controls.lastNameControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.lastNameControl
      .hasError("maxlength"))
      return "Last name must not be longer than 35 chars"

    return "Unknown error occurred :("
  }

  getPasswordErrorMessage(){
    if (this.passwordFormGroup.controls.passwordControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.passwordFormGroup.controls.passwordControl
      .hasError(Validators.pattern.name))
      return "Password must contain one uppercase character, one digit and be at least 8 characters long"

    return "Unknown error occurred :("
  }

  getPasswordConfirmationErrorMessage(){
    if (this.passwordFormGroup.controls.passwordConfirmationControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.passwordFormGroup.controls.passwordConfirmationControl
      .hasError(PasswordConfirmationEqualityValidator.name))
      return "Password confirmation must be the same as password"

    return "Unknown error occurred :("
  }

  onCheckboxClicked(){
    this.isUserAgreed = !this.isUserAgreed
    this.isCheckboxError = false
  }

  hideButtons(){
    this.isButtonsHidden = true
  }

  onSendConfirmationCode(code: string){
    console.log(code)
    //if response is correct - redirect to the main page
    this.confirmationCodeElement.reset()
  }
}
