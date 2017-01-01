import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';
import { MaterialModule }           from '@angular/material';
import { AlbumService }             from '../services/album.service';

import { AlbumComponent }           from './album.component';
import { AlbumListComponent }       from './album.list.component';
import { AlbumDetailComponent }     from './album.detail.component';
import { AlbumCreateComponent }     from './album.create.component';
import { AlbumOrgPhotoComponent }   from './album.orgphoto.component';
import { albumRouting }             from './album.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule.forRoot(),
        albumRouting
    ],
    declarations: [
        AlbumComponent,
        AlbumListComponent,
        AlbumDetailComponent,
        AlbumCreateComponent,
        AlbumOrgPhotoComponent
    ],

    providers: [
        AlbumService,
        //AlbumDetailResolve
    ]
})
export class AlbumModule { }
