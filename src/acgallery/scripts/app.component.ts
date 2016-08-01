import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AlbumComponent } from './album/album.component';
import { PhotoComponent } from './photo/photo.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/main.html',
    directives: [ROUTER_DIRECTIVES],
    precompile: [HomeComponent, AboutComponent, AlbumComponent, PhotoComponent]
})

export class AppComponent {
    title = 'AC Photo Gallery';
}