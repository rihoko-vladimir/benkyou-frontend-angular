import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'user-information-step',
  templateUrl: './user-information-step.component.html',
  styleUrls: ['./user-information-step.component.css']
})
export class UserInformationStepComponent implements OnInit {
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

  getUserNameErrorMessage() {
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

  getEmailErrorMessage() {
    if (this.credentialsFormGroup.controls.emailControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.emailControl
      .hasError(Validators.email.name))
      return "Incorrect email address provided"
    return "Unknown error occurred :("
  }

  getFirstNameErrorMessage() {
    if (this.credentialsFormGroup.controls.firstNameControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.firstNameControl
      .hasError("maxlength"))
      return "First name must not be longer than 20 chars"

    return "Unknown error occurred :("
  }

  getLastNameErrorMessage() {
    if (this.credentialsFormGroup.controls.lastNameControl
      .hasError(Validators.required.name))
      return "This field is required"
    if (this.credentialsFormGroup.controls.lastNameControl
      .hasError("maxlength"))
      return "Last name must not be longer than 35 chars"

    return "Unknown error occurred :("
  }

  constructor() { }

  ngOnInit(): void {
  }

}
