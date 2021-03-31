import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { UIModulesModule } from 'src/app/ui-modules.module';

import { PhotoListCoreComponent } from './photo-list-core';

@NgModule({
  declarations: [
    PhotoListCoreComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    UIModulesModule,
  ],
  exports: [
    PhotoListCoreComponent,
  ]
})
export class PhotoCommonModule { }
