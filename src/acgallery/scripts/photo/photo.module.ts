import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { PhotoService }             from './photo.service';

import { PhotoComponent }           from './photo.component';
import { PhotoListComponent }       from './photo.list.component';
import { PhotoUploadComponent }     from './photo.upload.component';
import { photoRouting }             from './photo.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        photoRouting
    ],
    declarations: [
        PhotoComponent,
        PhotoListComponent,
        PhotoUploadComponent
    ],

    providers: [
        PhotoService
    ]
})
export class PhotoModule { }
