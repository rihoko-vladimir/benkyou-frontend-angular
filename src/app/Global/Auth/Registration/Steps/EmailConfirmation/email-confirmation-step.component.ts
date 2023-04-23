import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {CodeInputComponent} from "angular-code-input";
import {AuthService} from "../../../../../Services/auth.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: "email-confirmation-step.component.html",
  styleUrls: ["email-confirmation-step.component.css"],
  selector: "email-confirmation-step"
})

export class EmailConfirmationStepComponent implements OnInit {
  @ViewChild("confirmationCode") confirmationCodeElement!: CodeInputComponent;
  @Input("email") email: string
  @Input("userId") userId: string
  fieldState: FieldState
  protected readonly FieldState = FieldState;

  constructor(private authService: AuthService, private router: Router) {
    this.userId = ""
    this.email = ""
    this.fieldState = FieldState.Default
  }

  ngOnInit(): void {
    const historyId = history.state['userId']

    if (historyId)
      this.userId = historyId;

    console.log(historyId)
  }

  onSendConfirmationCode(code: string) {
    this.confirmationCodeElement.disabled = true

    let observable = this.authService.confirmEmailAddress(this.userId, code)

    observable
      .subscribe({
        next: userId => {
          this.userId = userId
          this.fieldState = FieldState.Success
          this.router.navigate(["auth"])
        },
        error: () => {
          this.fieldState = FieldState.Error
          console.log("error!!")
        }
      })
  }

  fieldFocused() {
    this.fieldState = FieldState.Default
  }
}

enum FieldState {
  Success,
  Error,
  Default
}
