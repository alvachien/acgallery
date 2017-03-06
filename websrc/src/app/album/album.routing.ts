import { Routes, RouterModule }     from '@angular/router';
import { AlbumComponent }           from './album.component';
import { DetailComponent }          from './detail/detail.component';
import { ListComponent }            from './list/list.component';
import { CreateComponent }          from './create/create.component';
//import { AlbumOrgPhotoComponent }   from './album.orgphoto.component';
//import { CanDeactivateGuard }       from '../utility/can-deactivate-guard.service';

export const albumRoutes: Routes = [
    {
        path: 'album',
        component: AlbumComponent,
        children: [
            {
                path: 'create',
                component: CreateComponent
            },
            {
                path: 'detail/:id',
                component: DetailComponent,
                //canDeactivate: [CanDeactivateGuard],
                //resolve: {
                //    album: AlbumDetailResolve
                //}
            },
            // {
            //     path: 'orgphoto/:id',
            //     component: AlbumOrgPhotoComponent,
            // },
            {
                path: '',
                component: ListComponent
            },
        ]
    }
];

export const albumProviders = [
    //AuthGuard,
    //AuthService
];

//export const albumRouting = RouterModule.forChild(albumRoutes);
