import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { translocoLoader } from './transloco-loader';
import { translocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { IconsProviderModule } from './icons-provider.module';
import { environment } from 'src/environments/environment';
import { UIModulesModule } from './ui-modules.module';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    TranslocoModule,
    UIModulesModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'zh'],
        defaultLang: 'zh',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    translocoLoader,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
