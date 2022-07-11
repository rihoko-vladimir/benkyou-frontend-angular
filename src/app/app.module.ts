import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from "./Modules/routing.module";
import {AuthModule} from "./Modules/auth.module";
import {HttpClientModule} from "@angular/common/http";
import {HubModule} from "./Modules/hub.module";
import {NotFoundModule} from "./Modules/not-found.module";
import { StoreModule } from '@ngrx/store';
import {setStudyReducer} from "./Redux/Reducers/set-study.reducer";
import {allSetsReducer} from "./Redux/Reducers/all-sets.reducer";
import { EffectsModule } from '@ngrx/effects';
import {mySetsReducer} from "./Redux/Reducers/my-sets.reducer";

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
    StoreModule.forRoot({setStudy : setStudyReducer, allSets : allSetsReducer, mySets : mySetsReducer}),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
