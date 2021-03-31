import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'album', loadChildren: () => import('./pages/album/album.module').then(m => m.AlbumModule) },
  { path: 'photo', loadChildren: () => import('./pages/photo/photo.module').then(m => m.PhotoModule) },
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
  { path: 'credits', loadChildren: () => import('./pages/credits/credits.module').then(m => m.CreditsModule) },
  { path: 'user-detail', loadChildren: () => import('./pages/user-detail/user-detail.module').then(m => m.UserDetailModule) },
  { path: 'unauthorized', loadChildren: () => import('./pages/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule) },  
  
  { path: '**', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule )},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
