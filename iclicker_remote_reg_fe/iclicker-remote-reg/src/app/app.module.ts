import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CommonService } from './common.service'
import { HttpInterceptorService } from './http-interceptor.service'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CommonService, HttpInterceptorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
