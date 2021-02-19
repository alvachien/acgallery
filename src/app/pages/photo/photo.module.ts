import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoRoutingModule } from './photo-routing.module';
import { PhotoListComponent } from './photo-list';
import { PhotoDetailComponent } from './photo-detail';
import { UIModulesModule } from 'src/app/ui-modules.module';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    PhotoListComponent,
    PhotoDetailComponent,
  ],
  imports: [
    CommonModule,
    PhotoRoutingModule,
    UIModulesModule,
    TranslocoModule,
  ]
})
export class PhotoModule { }
