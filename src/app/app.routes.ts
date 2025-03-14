import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/welcome' },
    {
      path: 'welcome',
      loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
    },
    {
      path: 'album',
      loadChildren: () => import('./pages/album/album.routes').then((m) => m.ALBUM_ROUTES),
    },
    {
      path: 'photo',
      loadChildren: () => import('./pages/photo/photo.routes').then((m) => m.PHOTO_ROUTES),
    },
    {
      path: 'about',
      loadChildren: () => import('./pages/about/about.routes').then((m) => m.ABOUT_ROUTES),
    },
    {
      path: 'credits',
      loadChildren: () => import('./pages/credits/credits.routes').then((m) => m.CREDITS_ROUTES),
    },
    {
      path: 'userdetail',
      loadChildren: () => import('./pages/user-detail/user-detail.routes').then((m) => m.USER_DETAIL_ROUTERS),
    },
    {
      path: 'unauthorized',
      loadChildren: () => import('./pages/unauthorized/unauthorized.routes').then((m) => m.UNAUTHORIZED_ROUTES),
    },
  
    {
      path: '**',
      loadChildren: () => import('./pages/not-found/not-found.routes').then((m) => m.NOT_FOUND_ROUTES),
    },  
];
