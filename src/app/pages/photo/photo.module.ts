import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoRoutingModule } from './photo-routing.module';
import { PhotoListComponent } from '../Photo/photo-list/photo-list.component';
import { PhotoDetailComponent } from '../Photo/photo-detail/photo-detail.component';


@NgModule({
  declarations: [PhotoListComponent, PhotoDetailComponent],
  imports: [
    CommonModule,
    PhotoRoutingModule
  ]
})
export class PhotoModule { }
