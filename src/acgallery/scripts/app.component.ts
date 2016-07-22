import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AlbumComponent } from './album/album.component';
import { AlbumDetailComponent } from './album/album.detail.component';
import { AboutComponent } from './about/about.component';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{title}}</h1>
        <nav>
            <a href='' [routerLink]="['/home']" routerLinkActive="active">Home</a>
            <a href='' [routerLink]="['/albums']" routerLinkActive="active">Albums</a>
            <a href='' [routerLink]="['/about']" routerLinkActive="active">About</a>
        </nav>
        <router-outlet></router-outlet>
  `,
    styleUrls: ['app/css/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    precompile: [HomeComponent, AlbumComponent, AlbumDetailComponent, AboutComponent]
})

export class AppComponent {
    title = 'AC Gallery';
}