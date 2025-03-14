import { Routes } from '@angular/router';
import { AlbumDetailComponent } from './album-detail';
import { AlbumListComponent } from './album-list';

export const ALBUM_ROUTES: Routes = [
  { path: '', component: AlbumListComponent },
  // { path: 'create', component: AlbumDetailComponent },
  { path: 'display/:id', component: AlbumDetailComponent },
  {
    path: 'change/:id',
    component: AlbumDetailComponent,
  },
];
