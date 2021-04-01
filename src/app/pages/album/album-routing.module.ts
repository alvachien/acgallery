import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumDetailComponent } from './album-detail';
import { AlbumListComponent } from './album-list';

const routes: Routes = [
  { path: '', component: AlbumListComponent },
  // { path: 'create', component: AlbumDetailComponent },
  { path: 'display/:id', component: AlbumDetailComponent },
  { path: 'change/:id', component: AlbumDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
