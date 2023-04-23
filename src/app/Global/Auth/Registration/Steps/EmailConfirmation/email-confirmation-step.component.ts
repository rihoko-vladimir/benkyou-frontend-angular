import {Component, Input, ViewChild} from "@angular/core";
import {CodeInputComponent} from "angular-code-input";
import {AuthService} from "../../../../../Services/auth.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: "email-confirmation-step.component.html",
  styleUrls: ["email-confirmation-step.component.css"],
  selector: "email-confirmation-step"
})

export class EmailConfirmationStepComponent {
  @ViewChild("confirmationCode") confirmationCodeElement!: CodeInputComponent;
  @Input("email") email: string
  @Input("userId") userId: string

  constructor(private authService: AuthService, private router: Router) {
    this.userId = ""
    this.email = ""
  }

  onSendConfirmationCode(code: string) {
    this.confirmationCodeElement.disabled = true

    let observable = this.authService.confirmEmailAddress(this.userId, code)

    observable
      .subscribe(userId => {
        this.userId = userId
        this.router.navigate(["auth"])
      })
  }
}
