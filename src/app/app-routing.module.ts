import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlbumComponent } from './album/album.component';
import { AlbumlistComponent } from './albumlist/albumlist.component';
import { PhotolistComponent } from './photolist/photolist.component';
import { PhotouploadComponent } from './photoupload/photoupload.component';
import { PhotochangeComponent } from './photochange/photochange.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserDetailComponent } from './user-detail';
import { AuthGuard } from './services/authguard.service';
import { PhotoSearchComponent } from './photo-search';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'album',
    children: [
      {
        path: '',
        component: AlbumlistComponent,
      },
      {
        path: 'create',
        component: AlbumComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'display/:id',
        component: AlbumComponent,
      },
      {
        path: 'edit/:id',
        component: AlbumComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'photo',
    children: [
      {
        path: '',
        component: PhotolistComponent,
      },
      {
        path: 'search',
        component: PhotoSearchComponent,
      },
      {
        path: 'upload',
        component: PhotouploadComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'display',
        component: PhotochangeComponent,
      },
      {
        path: 'edit',
        component: PhotochangeComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: 'userdetail', component: UserDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
    ),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
  ],
})
export class AppRoutingModule { }
