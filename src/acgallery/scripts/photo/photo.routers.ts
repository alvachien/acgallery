import { RouterConfig }             from '@angular/router';
import { PhotoComponent }           from './photo.component';
import { PhotoListComponent }       from './photo.list.component';
import { PhotoDetailComponent }     from './photo.detail.component';
import { PhotoUploadComponent }     from './photo.upload.component';

export const PhotoRoutes: RouterConfig = [
    {
        path: 'photo',
        component: PhotoComponent,
        children: [
            //{
            //    path: 'admin',
            //    component: CrisisAdminComponent,
            //    canActivate: [AuthGuard]
            //},
            {
                path: 'upload',
                component: PhotoUploadComponent,
                //canDeactivate: [CanDeactivateGuard]
            },
            {
                path: ':id',
                component: PhotoDetailComponent,
                //canDeactivate: [CanDeactivateGuard]
            },
            {
                path: '',
                component: PhotoListComponent
            }
        ]
    }
];