import { BrowserModule} from '@angular/platform-browser';
import { Injectable, Injector, NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// User-Built Modules
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './error/page-not-found.component';
import { ErrorPageComponent } from './error/error-page.component';
import { TranslationResolver } from './framework/translation.resolver';

import { getI18n, getAppData, AppLoadService } from './framework/app-load.service';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot(APP_ROUTES),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TransferHttpCacheModule,

    TranslateModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ErrorPageComponent
  ],
  providers: [
    TranslationResolver,
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: getI18n, deps: [AppLoadService], multi: true },
    { provide: APP_INITIALIZER, useFactory: getAppData, deps: [AppLoadService], multi: true },
    DatePipe,
    { provide: 'req', useValue: null }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
