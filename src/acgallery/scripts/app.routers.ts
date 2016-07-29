import { provideRouter, RouterConfig }  from '@angular/router';

import { HomeRoutes } from './home/home.routers';
import { AlbumRoutes } from './album/album.routers';
import { PhotoRoutes } from './photo/photo.routers';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';
import { PageNotFoundComponent } from './pagenotfound.component';

export const routes: RouterConfig = [
    ...HomeRoutes,
    ...AlbumRoutes,
    ...PhotoRoutes,
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'credits',
        component: CreditsComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];