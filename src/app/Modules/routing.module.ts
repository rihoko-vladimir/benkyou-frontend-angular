import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthPageContainerComponent} from "../Global/Auth/auth-page-container.component";
import {LoginComponent} from "../Global/Auth/Login/login.component";
import {RegistrationComponent} from "../Global/Auth/Registration/registration.component";
import {PasswordResetComponent} from "../Global/Auth/PasswordReset/password-reset.component";
import {HubComponent} from "../Global/Hub/hub.component";
import {HomePageComponent} from "../Global/Hub/Pages/Home/home-page.component";
import {MySetsComponent} from "../Global/Hub/Pages/MySets/my-sets.component";
import {AllSetsComponent} from "../Global/Hub/Pages/AllSets/all-sets.component";
import {AccountComponent} from "../Global/Hub/Pages/Account/account.component";
import {NotFoundComponent} from "../Global/NotFound/not-found.component";
import {AuthGuard} from "../Guards/auth.guard";
import {StudyPageComponent} from "../Global/Hub/Pages/StudyPage/study-page.component";
import {NewPasswordComponent} from "../Global/Auth/NewPassword/new-password.component";
import {SetPasswordGuard} from "../Guards/set-password.guard";

const authRoutes: Routes = [
  {path: "", component: LoginComponent},
  {path: "register", component: RegistrationComponent},
  {
    path: "forgot-password/new-password",
    component: NewPasswordComponent,
    pathMatch: "full",
    canActivate: [SetPasswordGuard]
  },
  {path: "forgot-password", component: PasswordResetComponent},
]

const hubRoutes: Routes = [
  {path: "", component: HomePageComponent},
  {path: "my-sets", component: MySetsComponent},
  {path: "all-sets", component: AllSetsComponent},
  {path: "account", component: AccountComponent},
  {path: "study", component: StudyPageComponent}
]

const routes: Routes = [
  {path: "auth", component: AuthPageContainerComponent, children: authRoutes},
  {path: "hub", component: HubComponent, children: hubRoutes, canActivate: [AuthGuard]},
  {path: "not-found", component: NotFoundComponent},
  {path: "", redirectTo: "hub", pathMatch: "full"},
  {path: "**", redirectTo: "not-found"}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, SetPasswordGuard]
})

export class AppRoutingModule {
}
