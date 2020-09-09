import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CoreModule, TokenInterceptor, ErrorInterceptor } from './core';

import { SharedModule } from './shared/shared.module';

import { AppRoutes } from './app.routing';

import { AppComponent } from './app.component';
import * as fromComponents from './components';

@NgModule({
  imports: [BrowserModule, CoreModule, SharedModule, AppRoutes],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  declarations: [AppComponent, ...fromComponents.components],

  bootstrap: [AppComponent]
})
export class AppModule { }
