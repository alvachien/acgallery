import { Routes, RouterModule }     from '@angular/router';
import { albumRoutes }              from './album/album.routing';
import { photoRoutes }              from './photo/photo.routing';
import { homeRoutes }               from './home/home.routing';
import { aboutRoutes }              from './about/about.routing';
import { creditsRoutes }            from './credits/credits.routing';
//import { loginRoutes,
//    authProviders }  from './login.routing';

//import { CanDeactivateGuard } from './can-deactivate-guard.service';

const mainRoutes: Routes = [
    {
        path: '',
        redirectTo: '/photo',
        pathMatch: 'full'
    },
    {
        path: 'album',
        loadChildren: 'album/album.module#AlbumModule'
    },
    {
        path: 'photo',
        loadChildren: 'photo/photo.module#PhotoModule'
    }
];

const appRoutes: Routes = [
    ...mainRoutes,
    ...homeRoutes,
    ...aboutRoutes,
    ...creditsRoutes
];

export const appRoutingProviders: any[] = [
    //authProviders,
    //CanDeactivateGuard
];

export const routing = RouterModule.forRoot(appRoutes);
