import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from "./Modules/routing.module";
import {AuthModule} from "./Modules/auth.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HubModule} from "./Modules/hub.module";
import {NotFoundModule} from "./Modules/not-found.module";
import {StoreModule} from '@ngrx/store';
import {setStudyReducer} from "./Redux/Reducers/set-study.reducer";
import {allSetsReducer} from "./Redux/Reducers/all-sets.reducer";
import {EffectsModule} from '@ngrx/effects';
import {mySetsReducer} from "./Redux/Reducers/my-sets.reducer";
import {accountReducer} from "./Redux/Reducers/account.reducer";
import {environment} from "../environments/environment";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {hydrationMetaReducer} from "./Redux/Reducers/hydration.reducer";
import {JwtRefreshInterceptor} from "./Interceptors/JwtRefreshInterceptor";
import {MatNativeDateModule} from "@angular/material/core";
import {TimeoutInterceptor} from "./Interceptors/TimeoutInterceptor";
import {snackbarReducer} from "./Redux/Reducers/snackbar.reducer";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    HubModule,
    NotFoundModule,
    AppRoutingModule,
    HttpClientModule,
    MatNativeDateModule,
    StoreModule.forRoot({
      setStudy: setStudyReducer,
      allSets: allSetsReducer,
      mySets: mySetsReducer,
      account: accountReducer,
      snackbar: snackbarReducer
    }, {metaReducers: [hydrationMetaReducer]}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtRefreshInterceptor,
    multi: true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
