import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { UIModulesModule } from 'src/app/ui-modules.module';


@NgModule({
  declarations: [
    AlbumListComponent, 
    AlbumDetailComponent,
  ],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    UIModulesModule,
    TranslocoModule,
  ]
})
export class AlbumModule { }
