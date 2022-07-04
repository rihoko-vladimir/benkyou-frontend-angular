import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthPageContainerComponent} from "../Auth/auth-page-container.component";
import {LoginComponent} from "../Auth/Login/login.component";
import {RegistrationComponent} from "../Auth/Registration/registration.component";
import {PasswordResetComponent} from "../Auth/PasswordReset/password-reset.component";
import {HubComponent} from "../Hub/hub.component";
import {HomePageComponent} from "../Hub/Pages/Home/home-page.component";
import {MySetsComponent} from "../Hub/Pages/MySets/my-sets.component";
import {AllSetsComponent} from "../Hub/Pages/AllSets/all-sets.component";
import {AccountComponent} from "../Hub/Pages/Account/account.component";
import {NotFoundComponent} from "../NotFound/not-found.component";

const authRoutes : Routes = [
  {path: "", component: LoginComponent},
  {path: "register", component: RegistrationComponent},
  {path: "forgot-password", component: PasswordResetComponent},
  {path: "**", redirectTo:"../not-found"}
]

const hubRoutes: Routes = [
  {path: "", component: HomePageComponent},
  {path: "my-sets", component: MySetsComponent},
  {path: "all-sets", component: AllSetsComponent},
  {path: "account", component: AccountComponent}
]

const routes : Routes = [
  {path: "auth", component: AuthPageContainerComponent, children: authRoutes},
  {path: "hub", component: HubComponent, children: hubRoutes},
  {path: "not-found", component: NotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
