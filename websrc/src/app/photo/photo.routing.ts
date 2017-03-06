import { Routes, RouterModule } from '@angular/router';
import { PhotoComponent }       from './photo.component';
import { ListComponent }        from './list/list.component';
import { UploadComponent }      from './upload/upload.component';
//import { PhotoAssignAlbumComponent } from './photo.assignalbum.component';

export const photoRoutes: Routes = [
    {
        path: 'photo',
        component: PhotoComponent,
        children: [
            {
                path: 'upload',
                component: UploadComponent
            },
            // {
            //     path: 'assignalbum/:photoid',
            //     component: PhotoAssignAlbumComponent
            // },
            {
                path: '',
                component: ListComponent
            }
        ]
    }
];

//export const photoRouting = RouterModule.forChild(photoRoutes);
