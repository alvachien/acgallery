import { Routes } from '@angular/router';
import { PhotoListComponent } from './photo-list';
import { PhotoDetailComponent } from './photo-detail';
import { PhotoUploadComponent } from './photo-upload';
import { PhotoSearchComponent } from './photo-search';
import { AuthGuard, CanDeactivateGuard } from '../../../app/services';

export const PHOTO_ROUTES: Routes = [
  { path: '', component: PhotoListComponent },
  { path: 'display/:id', component: PhotoDetailComponent },
  {
    path: 'upload',
    component: PhotoUploadComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  { path: 'search', component: PhotoSearchComponent },
  { path: 'searchinalbum/:id', component: PhotoSearchComponent },
];

