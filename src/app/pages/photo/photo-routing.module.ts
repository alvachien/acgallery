import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoListComponent } from './photo-list';
import { PhotoDetailComponent } from './photo-detail';
import { PhotoUploadComponent } from './photo-upload';
import { PhotoSearchComponent } from './photo-search';
import { CanDeactivateGuard } from 'src/app/services';

const routes: Routes = [
  { path: '', component: PhotoListComponent },
  { path: 'display/:id', component: PhotoDetailComponent },
  { path: 'upload', component: PhotoUploadComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'search', component: PhotoSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoRoutingModule { }
