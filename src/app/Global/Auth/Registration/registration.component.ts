import {Component, ViewChild} from "@angular/core";
import {MatStepper} from "@angular/material/stepper";
import {Router} from "@angular/router";
import {AuthService} from "../../../Services/auth.service";
import {finalize} from "rxjs";
import {UserInformationStepComponent} from "./Steps/UserInformation/user-information-step.component";
import {PasswordStepComponent} from "./Steps/Password/password-step.component";
import {TermsStepComponent} from "./Steps/Terms/terms-step.component";
import {EmailConfirmationStepComponent} from "./Steps/EmailConfirmation/email-confirmation-step.component";


@Component({
  selector: "registration",
  templateUrl: "registration.component.html",
  styleUrls: ["registration.component.css"],
  animations: []
})

export class RegistrationComponent {
  areButtonsHidden: boolean
  isLoading: boolean = false
  @ViewChild("stepper") stepper!: MatStepper;
  @ViewChild("userInformationStepComponent") userInformationStepComponent!: UserInformationStepComponent
  @ViewChild("passwordStepComponent") passwordStepComponent!: PasswordStepComponent
  @ViewChild("termsStepComponent") termsStepComponent!: TermsStepComponent
  @ViewChild("emailConfirmationStepComponent") emailConfirmationStepComponent!: EmailConfirmationStepComponent
  userId: string

  constructor(private router: Router, private authService: AuthService) {
    this.areButtonsHidden = false
    this.userId = ""
  }

  onNextClicked() {
    switch (this.stepper.selectedIndex) {
      case 0: {
        if (this.userInformationStepComponent.credentialsFormGroup.valid)
          this.stepper.next()
        else
          this.userInformationStepComponent.credentialsFormGroup.markAllAsTouched()
        break
      }
      case 1: {
        if (this.passwordStepComponent.passwordFormGroup.valid)
          this.stepper.next()
        else
          this.passwordStepComponent.passwordFormGroup.markAllAsTouched()
        break
      }
      case 2: {
        if (this.termsStepComponent.isUserAgreed) {
          let observable = this.authService.register(
            this.userInformationStepComponent.credentialsFormGroup.controls.userNameControl.value!,
            this.userInformationStepComponent.credentialsFormGroup.controls.emailControl.value!,
            this.userInformationStepComponent.credentialsFormGroup.controls.firstNameControl.value!,
            this.userInformationStepComponent.credentialsFormGroup.controls.lastNameControl.value!,
            this.passwordStepComponent.passwordFormGroup.controls.passwordControl.value!)
          this.isLoading = true
          observable
            .pipe(
              finalize(() => this.isLoading = false)
            )
            .subscribe(
              userId => {
                this.userId = userId
                this.hideButtons()
                this.stepper.next()
              })
        } else {
          this.termsStepComponent.isCheckboxError = true
        }
        break
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

  hideButtons() {
    this.areButtonsHidden = true
  }
}
