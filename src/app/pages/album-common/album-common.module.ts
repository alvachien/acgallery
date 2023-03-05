import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { AlbumHeaderComponent } from './album-header';

@NgModule({
  declarations: [
    AlbumHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,

    NzFormModule,
    NzInputModule,
    NzCheckboxModule,    
  ],
  exports: [
    AlbumHeaderComponent,
  ]
})
export class AlbumCommonModule { }
