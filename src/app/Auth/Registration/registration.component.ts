import {Component, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {Router} from "@angular/router";


@Component({
  selector: "registration",
  templateUrl: "registration.component.html",
  styleUrls: ["registration.component.css"],
  animations: []
})

export class RegistrationComponent {
  constructor(private router: Router) {
  }

  @ViewChild("stepper") stepper: MatStepper | any;
  credentialsFormGroup = new FormGroup({
    userControl: new FormControl(""),
    emailControl: new FormControl(""),
    firstNameControl: new FormControl(""),
    lastNameControl: new FormControl("")
  })
  passwordFormGroup = new FormGroup({
    passwordControl: new FormControl(""),
    passwordConfirmationControl: new FormControl("")
  })
  formGroups = [this.credentialsFormGroup, this.passwordFormGroup]

  onNextClicked() {
    this.stepper.next()
  }

  async onPreviousClicked() {
    if (this.stepper.selectedIndex == 0) {
      await this.router.navigate(["auth"])
      return
    }
    this.stepper.previous()
  }
}
