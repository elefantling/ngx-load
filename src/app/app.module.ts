import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLoadModule } from 'projects/ngx-load/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxLoadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
