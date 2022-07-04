import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from "./Modules/routing.module";
import {AuthModule} from "./Modules/auth.module";
import {HttpClientModule} from "@angular/common/http";
import {HubModule} from "./Modules/hub.module";
import {NotFoundModule} from "./Modules/not-found.module";

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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
