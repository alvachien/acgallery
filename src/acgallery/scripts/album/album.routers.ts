import { RouterConfig }             from '@angular/router';
import { AlbumComponent }           from './album.component';
import { AlbumListComponent }       from './album.list.component';
import { AlbumDetailComponent }     from './album.detail.component';

export const AlbumRoutes: RouterConfig = [
    {
        path: 'album',
        component: AlbumComponent,
        children: [
            //{
            //    path: 'admin',
            //    component: CrisisAdminComponent,
            //    canActivate: [AuthGuard]
            //},
            {
                path: ':id',
                component: AlbumDetailComponent,
                //canDeactivate: [CanDeactivateGuard]
            },
            {
                path: '',
                component: AlbumListComponent
            }
        ]
    }
];