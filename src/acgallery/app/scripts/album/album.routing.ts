import { Routes, RouterModule }     from '@angular/router';
import { AlbumComponent }           from './album.component';
import { AlbumDetailComponent }     from './album.detail.component';
import { AlbumListComponent }       from './album.list.component';
import { AlbumCreateComponent }     from './album.create.component';
import { AlbumOrgPhotoComponent }   from './album.orgphoto.component';
import { CanDeactivateGuard }       from '../utility/can-deactivate-guard.service';

export const albumRoutes: Routes = [
    {
        path: 'album',
        component: AlbumComponent,
        children: [
            {
                path: 'create',
                component: AlbumCreateComponent
            },
            {
                path: 'detail/:id',
                component: AlbumDetailComponent,
                //canDeactivate: [CanDeactivateGuard],
                //resolve: {
                //    album: AlbumDetailResolve
                //}
            },
            {
                path: 'orgphoto/:id',
                component: AlbumOrgPhotoComponent,
            },
            {
                path: '',
                component: AlbumListComponent
            },
        ]
    }
];

export const albumProviders = [
    //AuthGuard,
    //AuthService
];

export const albumRouting = RouterModule.forChild(albumRoutes);
