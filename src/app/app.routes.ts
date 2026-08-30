import { Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { NotFoundComponent } from './Global/NotFound/not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./Global/Auth/auth.routes').then(m => m.authRoutes),
    data: {
      animation: 'auth'
    }
  },
  {
    path: 'hub',
    loadChildren: () => import('./Global/Hub/hub.routes').then(m => m.hubRoutes),
    canActivate: [AuthGuard],
    data: {
      animation: 'hub'
    }
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: {
      animation: 'not-found'
    }
  },
  { path: '', redirectTo: 'hub', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' }
];
