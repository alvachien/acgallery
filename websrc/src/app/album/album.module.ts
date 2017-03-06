import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule }   from '@angular/material';

import { AlbumService }     from '../services/album.service';

import { AlbumComponent }  from './album.component';
import { ListComponent }   from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { albumRoutes }     from './album.routing';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forChild(albumRoutes)
  ],
  declarations: [AlbumComponent, ListComponent, CreateComponent, DetailComponent],
  providers:[
    AlbumService
  ]
})
export class AlbumModule { }
