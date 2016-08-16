import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { AlbumService }             from './album.service';
import { AlbumDetailResolve }       from './album.detail.resolve.service';

import { AlbumComponent }           from './album.component';
import { AlbumListComponent }       from './album.list.component';
import { AlbumDetailComponent }     from './album.detail.component';
import { albumRouting }             from './album.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        albumRouting
    ],
    declarations: [
        AlbumComponent,
        AlbumListComponent,
        AlbumDetailComponent
    ],

    providers: [
        AlbumService,
        AlbumDetailResolve
    ]
})
export class AlbumModule { }
