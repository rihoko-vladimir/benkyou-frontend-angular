import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthPageContainerComponent} from "../Auth/auth-page-container.component";
import {LoginComponent} from "../Auth/Login/login.component";
import {RegistrationComponent} from "../Auth/Registration/registration.component";
import {PasswordResetComponent} from "../Auth/PasswordReset/password-reset.component";

const authRoutes : Routes = [
  {path: "", component: LoginComponent},
  {path: "register", component: RegistrationComponent},
  {path: "forgot-password", component: PasswordResetComponent}
]

const routes : Routes = [
  {path: "auth", component: AuthPageContainerComponent, children: authRoutes}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
