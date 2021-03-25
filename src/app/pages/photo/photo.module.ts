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
import { PhotoListCoreComponent } from './photo-list-core';

@NgModule({
  declarations: [
    PhotoListComponent,
    PhotoDetailComponent,
    PhotoUploadComponent,
    PhotoSearchComponent,
    PhotoListCoreComponent,
  ],
  imports: [
    CommonModule,
    PhotoRoutingModule,
    UIModulesModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PhotoModule { }
