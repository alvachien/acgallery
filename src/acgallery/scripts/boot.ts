import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routers';

bootstrap(AppComponent, [appRouterProviders]);
