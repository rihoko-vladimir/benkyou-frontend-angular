import { Routes } from '@angular/router';
import { AuthPageContainerComponent } from './auth-page-container.component';
import { LoginComponent } from './Login/login.component';
import { RegistrationComponent } from './Registration/registration.component';
import { NewPasswordComponent } from './NewPassword/new-password.component';
import { PasswordResetComponent } from './PasswordReset/password-reset.component';
import { SetPasswordGuard } from '../../Guards/set-password.guard';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthPageContainerComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        data: {
          animation: 'auth'
        }
      },
      {
        path: 'register',
        component: RegistrationComponent,
        data: {
          animation: 'register'
        }
      },
      {
        path: 'forgot-password/new-password',
        component: NewPasswordComponent,
        pathMatch: 'full',
        canActivate: [SetPasswordGuard],
        data: {
          animation: 'reset-password'
        }
      },
      {
        path: 'forgot-password',
        component: PasswordResetComponent,
        data: {
          animation: 'forgot-password'
        }
      }
    ],
    data: {
      animation: 'auth'
    }
  }
];
