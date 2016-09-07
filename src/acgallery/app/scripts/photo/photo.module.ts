import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';

import { PhotoService }             from './photo.service';

import { PhotoComponent }           from './photo.component';
import { PhotoListComponent }       from './photo.list.component';
import { PhotoUploadComponent }     from './photo.upload.component';
import { PhotoAssignAlbumComponent } from './photo.assignalbum.component';
import { photoRouting }             from './photo.routing';
import { Ng2BootstrapModule }       from 'ng2-bootstrap/ng2-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Ng2BootstrapModule,
        photoRouting
    ],
    declarations: [
        PhotoComponent,
        PhotoListComponent,
        PhotoUploadComponent,
        PhotoAssignAlbumComponent
    ],

    providers: [
        PhotoService
    ]
})
export class PhotoModule { }
