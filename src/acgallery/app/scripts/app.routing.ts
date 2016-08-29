import { Routes, RouterModule }     from '@angular/router';
import { albumRoutes }              from './album/album.routing';
import { photoRoutes }              from './photo/photo.routing';
import { homeRoutes }               from './home/home.routing';
import { aboutRoutes }              from './about/about.routing';
import { forbiddenRoutes }          from './forbidden/forbidden.routing';
import { unauthorizedRoutes }       from './unauthorized/unauthorized.routing';

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
    ...forbiddenRoutes,
    ...unauthorizedRoutes
];

export const appRoutingProviders: any[] = [
    //authProviders,
    //CanDeactivateGuard
];

export const routing = RouterModule.forRoot(appRoutes);
