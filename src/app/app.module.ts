import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; //add for template-driven forms
import { HttpClientModule } from '@angular/common/http'; //add for HTTP requests

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule //เรียกapi
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
