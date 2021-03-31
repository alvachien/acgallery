import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PhotoRoutingModule } from './photo-routing.module';
import { PhotoListComponent } from './photo-list';
import { PhotoDetailComponent } from './photo-detail';
import { PhotoUploadComponent } from './photo-upload';
import { UIModulesModule } from 'src/app/ui-modules.module';
import { TranslocoModule } from '@ngneat/transloco';
import { PhotoSearchComponent } from './photo-search';
import { PhotoCommonModule } from '../photo-common/photo-common.module';

@NgModule({
  declarations: [
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoUploadComponent,
    PhotoSearchComponent,
  ],
  imports: [
    CommonModule,
    PhotoRoutingModule,
    UIModulesModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    PhotoCommonModule,
  ]
})
export class PhotoModule { }
