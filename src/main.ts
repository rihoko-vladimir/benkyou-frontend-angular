import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { setStudyReducer } from './app/Redux/Reducers/set-study.reducer';
import { allSetsReducer } from './app/Redux/Reducers/all-sets.reducer';
import { mySetsReducer } from './app/Redux/Reducers/my-sets.reducer';
import { accountReducer } from './app/Redux/Reducers/account.reducer';
import { snackbarReducer } from './app/Redux/Reducers/snackbar.reducer';
import { hydrationMetaReducer } from './app/Redux/Reducers/hydration.reducer';
import { JwtRefreshInterceptor } from './app/Interceptors/JwtRefreshInterceptor';
import { HttpErrorInterceptor } from './app/Interceptors/HttpErrorInterceptor';
import { TimeoutInterceptor } from './app/Interceptors/TimeoutInterceptor';
import { ThemeService } from './app/Services/theme.service';
import { AuthService } from './app/Services/auth.service';
import { AllSetsService } from './app/Services/all-sets.service';
import { MySetsService } from './app/Services/my-sets.service';
import { AccountService } from './app/Services/account.service';
import { SetsApiService } from './app/Services/sets-api.service';
import { AuthGuard } from './app/Guards/auth.guard';
import { SetPasswordGuard } from './app/Guards/set-password.guard';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(
      {
        setStudy: setStudyReducer,
        allSets: allSetsReducer,
        mySets: mySetsReducer,
        account: accountReducer,
        snackbar: snackbarReducer
      },
      { metaReducers: [hydrationMetaReducer] }
    ),
    provideEffects([]),
    !environment.production ? provideStoreDevtools() : [],
    ThemeService,
    AuthService,
    AllSetsService,
    MySetsService,
    SetsApiService,
    AccountService,
    AuthGuard,
    SetPasswordGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtRefreshInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
}).catch(err => console.error(err));
