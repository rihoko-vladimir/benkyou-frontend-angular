import {Component, Input, ViewChild} from "@angular/core";
import {CodeInputComponent} from "angular-code-input";
import {AuthService} from "../../../../Services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "test-component",
  templateUrl: "test.component.html",
  styleUrls: ["test.component.css"]
})

export class TestComponent {
  @ViewChild("confirmationCode") confirmationCodeElement!: CodeInputComponent;
  @Input("email") email: string
  @Input("userId") userId: string
  fieldState: FieldState

  constructor(private authService: AuthService, private router: Router) {
    this.userId = ""
    this.email = ""
    this.fieldState = FieldState.Default
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

  protected readonly FieldState = FieldState;
}

enum FieldState {
  Success,
  Error,
  Default
}
