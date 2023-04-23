import {NgModule} from "@angular/core";
import {AuthPageContainerComponent} from "../Global/Auth/auth-page-container.component";
import {LoginComponent} from "../Global/Auth/Login/login.component";
import {RegistrationComponent} from "../Global/Auth/Registration/registration.component";
import {PasswordResetComponent} from "../Global/Auth/PasswordReset/password-reset.component";
import {MaterialModule} from "./material.module";
import {AppRoutingModule} from "./routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CodeInputModule} from "angular-code-input";
import {AuthService} from "../Services/auth.service";
import {NewPasswordComponent} from "../Global/Auth/NewPassword/new-password.component";
import {TermsStepComponent} from "../Global/Auth/Registration/Steps/Terms/terms-step.component";
import {
  UserInformationStepComponent
} from "../Global/Auth/Registration/Steps/UserInformation/user-information-step.component";
import {PasswordStepComponent} from "../Global/Auth/Registration/Steps/Password/password-step.component";
import {
  EmailConfirmationStepComponent
} from "../Global/Auth/Registration/Steps/EmailConfirmation/email-confirmation-step.component";

@NgModule({
  declarations: [
    AuthPageContainerComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordResetComponent,
    NewPasswordComponent,
    PasswordStepComponent,
    EmailConfirmationStepComponent,
    TermsStepComponent,
    UserInformationStepComponent],
  imports: [
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserModule,
    CodeInputModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService]
})

export class AuthModule {
}
