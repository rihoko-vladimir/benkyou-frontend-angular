import {NgModule} from "@angular/core";
import {AuthPageContainerComponent} from "../Auth/auth-page-container.component";
import {LoginComponent} from "../Auth/Login/login.component";
import {RegistrationComponent} from "../Auth/Registration/registration.component";
import {PasswordResetComponent} from "../Auth/PasswordReset/password-reset.component";
import {MaterialModule} from "./material.module";
import {AppRoutingModule} from "./routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CodeInputModule} from "angular-code-input";
import {AuthService} from "../Services/auth.service";

@NgModule({
  declarations: [
    AuthPageContainerComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordResetComponent],
  imports: [
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CodeInputModule
  ],
  providers: [AuthService]
})

export class AuthModule {}
