import { Component, OnInit }                from '@angular/core';
import { AlbumService }                     from './album.service';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { AlbumListComponent }               from './album.list.component';
import { AlbumDetailComponent }             from './album.detail.component';


@Component({
    templateUrl: 'app/views/album/album.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [AlbumService],
    precompile: [AlbumListComponent, AlbumDetailComponent]
})
export class AlbumComponent { }
