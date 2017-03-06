import { Routes, RouterModule }     from '@angular/router';
import { albumRoutes }              from './album/album.routing';
import { photoRoutes }              from './photo/photo.routing';
import { homeRoutes }               from './home/home.routing';
import { portfolioRoutes  }         from './portfolio/portfolio.routing';
import { aboutRoutes }              from './about/about.routing';
// import { forbiddenRoutes }          from './forbidden/forbidden.routing';
// import { unauthorizedRoutes }       from './unauthorized/unauthorized.routing';

const mainRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'album',
        loadChildren: 'app/album/album.module#AlbumModule'
    },
    {
        path: 'photo',
        loadChildren: 'app/photo/photo.module#PhotoModule'
    }
];

export const appRoutes: Routes = [
    ...mainRoutes,
    ...homeRoutes,
    ...portfolioRoutes,
    ...aboutRoutes,
    // ...forbiddenRoutes,
    // ...unauthorizedRoutes
];

export const appRoutingProviders: any[] = [
    //authProviders,
    //CanDeactivateGuard
];

//export const routing = RouterModule.forRoot(appRoutes);
