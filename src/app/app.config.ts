import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, isDevMode, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
//import { ThemeService } from './services/theme.service';
import { authConfig } from './auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideNzIcons(icons), 
    provideNzI18n(zh_CN), 
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(), 
    provideHttpClient(),
    // provideAppInitializer(() => {
    //   let themesevice = inject(ThemeService);
    //   themesevice.loadTheme(true);
    // }),
    provideTransloco({
      config: { 
        availableLangs: ['en', 'zh_CN'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideAuth(authConfig),
  ]
};
