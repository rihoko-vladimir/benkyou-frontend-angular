import { NgModule } from '@angular/core';
import { AuthPageContainerComponent } from '../Global/Auth/auth-page-container.component';
import { LoginComponent } from '../Global/Auth/Login/login.component';
import { RegistrationComponent } from '../Global/Auth/Registration/registration.component';
import { PasswordResetComponent } from '../Global/Auth/PasswordReset/password-reset.component';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CodeInputModule } from 'angular-code-input';
import { AuthService } from '../Services/auth.service';
import { NewPasswordComponent } from '../Global/Auth/NewPassword/new-password.component';

@NgModule({
  declarations: [
    AuthPageContainerComponent,
    LoginComponent,
    RegistrationComponent,
    PasswordResetComponent,
    NewPasswordComponent
  ],
  imports: [AppRoutingModule, MaterialModule, FormsModule, BrowserModule, CodeInputModule, ReactiveFormsModule],
  providers: [AuthService]
})
export class AuthModule {}
