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
import {TestComponent} from "../Global/Hub/Components/TestComponent/test.component";
import {
  EmailConfirmationStepComponent
} from "../Global/Auth/Registration/Steps/EmailConfirmation/email-confirmation-step.component";

const authRoutes: Routes = [
  {
    path: "", component: LoginComponent, data: {
      animation: "auth"
    }
  },
  {
    path: "register", component: RegistrationComponent, data: {
      animation: "register"
    }
  },
  {
    path: "confirm-email", component: EmailConfirmationStepComponent, data: {
      animation: "confirm-email"
    }
  },
  {
    path: "forgot-password/new-password",
    component: NewPasswordComponent,
    pathMatch: "full",
    canActivate: [SetPasswordGuard],
    data: {
      animation: "reset-password"
    },
  },
  {
    path: "forgot-password", component: PasswordResetComponent, data: {
      animation: "forgot-password"
    }
  },
]

const hubRoutes: Routes = [
  {path: "", component: HomePageComponent, data: {animation: "Home"}},
  {path: "my-sets", component: MySetsComponent, data: {animation: "MySets"}},
  {path: "all-sets", component: AllSetsComponent, data: {animation: "AllSets"}},
  {path: "account", component: AccountComponent, data: {animation: "Account"}},
  {path: "study", component: StudyPageComponent, data: {animation: "Study"}},
  {
    path: "test-component", component: TestComponent
  },
]

const routes: Routes = [
  {
    path: "auth", component: AuthPageContainerComponent, children: authRoutes, data: {
      animation: 'auth'
    }
  },
  {
    path: "hub", component: HubComponent, children: hubRoutes, canActivate: [AuthGuard], data: {
      animation: 'hub'
    }
  },
  {
    path: "not-found", component: NotFoundComponent, data: {
      animation: 'not-found'
    }
  },
  {
    path: "test-component", component: TestComponent
  },
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
