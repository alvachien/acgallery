import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/welcome' },
    {
      path: 'welcome',
      loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
    },
    {
      path: 'album',
      loadChildren: () => import('./pages/album/album.module').then((m) => m.AlbumModule),
    },
    {
      path: 'photo',
      loadChildren: () => import('./pages/photo/photo.module').then((m) => m.PhotoModule),
    },
    {
      path: 'about',
      loadChildren: () => import('./pages/about/about.routes').then((m) => m.ABOUT_ROUTES),
    },
    {
      path: 'credits',
      loadChildren: () => import('./pages/credits/credits.module').then((m) => m.CreditsModule),
    },
    {
      path: 'userdetail',
      loadChildren: () => import('./pages/user-detail/user-detail.module').then((m) => m.UserDetailModule),
    },
    {
      path: 'unauthorized',
      loadChildren: () => import('./pages/unauthorized/unauthorized.module').then((m) => m.UnauthorizedModule),
    },
  
    {
      path: '**',
      loadChildren: () => import('./pages/not-found/not-found.module').then((m) => m.NotFoundModule),
    },  
];
