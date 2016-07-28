import { provideRouter, RouterConfig }  from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AlbumComponent } from './album/album.component';
import { AlbumDetailComponent } from './album/album.detail.component';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';

const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'albumdetail/:id',
        component: AlbumDetailComponent
    },
    {
        path: 'albums',
        component: AlbumComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'credits',
        component: CreditsComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];