import { AppComponent, environment }  from './app.component';
import { enableProdMode }             from '@angular/core';
import { platformBrowserDynamic }     from '@angular/platform-browser-dynamic';
import { AppModule }                  from './app.module';

if (environment === 'Productive') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
