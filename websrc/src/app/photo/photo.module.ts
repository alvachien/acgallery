import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule }       from '@angular/material';
import { CovalentCoreModule }   from '@covalent/core';
import { CovalentFileModule }   from '@covalent/file-upload';
import { CovalentDataTableModule } from '@covalent/data-table';

import { PhotoService }         from '../services/photo.service';

import { PhotoComponent }       from './photo.component';
import { ListComponent }        from './list/list.component';
import { UploadComponent }      from './upload/upload.component';
import { photoRoutes }          from './photo.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(photoRoutes),
    CovalentCoreModule.forRoot(),
    CovalentFileModule.forRoot(),
    CovalentDataTableModule.forRoot(),
  ],
  declarations: [PhotoComponent, ListComponent, UploadComponent],
  providers: [
    PhotoService
  ]
})
export class PhotoModule { }
