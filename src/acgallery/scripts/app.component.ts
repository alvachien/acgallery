import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AlbumComponent } from './album/album.component';
import { AlbumDetailComponent } from './album/album.detail.component';
import { AboutComponent } from './about/about.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/main.html',
    directives: [ROUTER_DIRECTIVES],
    precompile: [HomeComponent, AlbumComponent, AlbumDetailComponent, AboutComponent]
})

export class AppComponent {
    title = 'AC Photo Gallery';
}