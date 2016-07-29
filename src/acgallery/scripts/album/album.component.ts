import { Component, OnInit }                from '@angular/core';
import { AlbumService }                     from './album.service';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';

@Component({
    templateUrl: 'app/views/album/album.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [AlbumService]
})
export class AlbumComponent { }
