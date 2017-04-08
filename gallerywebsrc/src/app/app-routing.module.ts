import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlbumlistComponent } from './albumlist/albumlist.component';
import { AlbumComponent } from './album/album.component';
import { PhotolistComponent } from './photolist/photolist.component';
import { PhotouploadComponent } from './photoupload/photoupload.component';
//import { UserdetailComponent } from './userdetail/userdetail.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

//import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
//import { AuthGuard } from './services/auth-guard.service';
//import { PreloadSelectedModules } from './services/selective-preload-strategy';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'album',
    children: [
        {
            path: '',
            component: AlbumlistComponent
        },
        {
            path: 'create',
            component: AlbumComponent
        },
        {
            path: 'display/:id',
            component: AlbumComponent
        },
        {
            path: 'edit/:id',
            component: AlbumComponent
        },
    ]
  },
  {
    path: 'photo',
    children: [
        {
            path: '',
            component: PhotolistComponent
        },
        {
            path: 'upload',
            component: PhotouploadComponent
        },
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
