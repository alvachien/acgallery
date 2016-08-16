import { Routes, RouterModule } from '@angular/router';
import { PhotoComponent }       from './photo.component';
import { PhotoListComponent }   from './photo.list.component';
import { PhotoUploadComponent } from './photo.upload.component';

export const photoRoutes: Routes = [
    {
        path: 'photo',
        component: PhotoComponent,
        children: [
            {
                path: 'upload',
                component: PhotoUploadComponent
            },
            {
                path: '',
                component: PhotoListComponent
            }
        ]
    }
];

export const photoRouting = RouterModule.forChild(photoRoutes);
