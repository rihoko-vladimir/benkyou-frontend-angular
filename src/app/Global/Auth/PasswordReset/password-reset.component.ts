import {Component, ViewChild} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: "password-reset",
  templateUrl: "password-reset.component.html",
  styleUrls: ["password-reset.component.css"]
})

export class PasswordResetComponent{
  emailControl = new FormControl("",
    [Validators.required, Validators.email])

  @ViewChild("stepper") stepper: MatStepper | any

  constructor(private router: Router) {
  }

  getEmailErrorMessage(){
    if (this.emailControl.hasError(Validators.required.name))
      return "This field is required to continue :P"

    if (this.emailControl.hasError(Validators.email.name))
      return "Incorrect email address provided"

    return "Unknown error occurred"
  }

  async onCancelClicked(){
    await this.router.navigate(["auth"])
  }

  onNextClicked() {
    if (this.emailControl.valid){
      this.stepper.next()
    }else{
      this.emailControl.markAsTouched()
    }
  }

  async onFinishClicked(){
    await this.router.navigate(["auth"])
  }
}
