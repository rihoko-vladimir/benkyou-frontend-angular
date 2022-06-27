import {NgModule} from "@angular/core";
import {AuthPageContainerComponent} from "./auth-page-container.component";
import {LoginComponent} from "./Login/login.component";
import {RegistrationComponent} from "./Registration/registration.component";
import {PasswordResetComponent} from "./PasswordReset/password-reset.component";
import {MaterialModule} from "../Modules/material.module";
import {AppRoutingModule} from "../Modules/routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    AuthPageContainerComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordResetComponent],
  imports: [AppRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, BrowserModule]
})

export class AuthModule {}
