import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';

import { PhotoService }             from './photo.service';

import { PhotoComponent }           from './photo.component';
import { PhotoListComponent }       from './photo.list.component';
import { PhotoUploadComponent }     from './photo.upload.component';
import { PhotoAssignAlbumComponent } from './photo.assignalbum.component';
import { photoRouting }             from './photo.routing';
import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        photoRouting,
        NgbModule
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
