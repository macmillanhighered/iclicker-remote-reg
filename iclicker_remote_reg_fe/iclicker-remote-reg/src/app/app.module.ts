import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CommonService } from './common.service'
import { HttpInterceptorService } from './http-interceptor.service'
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventLogsService } from './event-logs.service'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CommonService, EventLogsService, DatePipe, {
      provide : HTTP_INTERCEPTORS,
      useClass : HttpInterceptorService,
      multi : true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
