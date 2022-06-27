import {NgModule} from "@angular/core";
import {AppModule} from "../app.module";
import {AuthPageContainerComponent} from "./auth-page-container.component";
import {LoginComponent} from "./Login/login.component";
import {RegistrationComponent} from "./Registration/registration.component";
import {PasswordResetComponent} from "./PasswordReset/password-reset.component";
import {MaterialModule} from "../Modules/material.module";
import {AppRoutingModule} from "../Modules/routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  exports: [AppModule],
  declarations: [
    AuthPageContainerComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordResetComponent],
  imports: [MaterialModule, AppRoutingModule, FormsModule, ReactiveFormsModule, BrowserModule]
})

export class AuthModule {}
