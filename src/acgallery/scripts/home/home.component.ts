import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app-home',
    templateUrl: 'app/views/home.html',
    providers: [
    ]
})

export class HomeComponent implements OnInit {
    title = 'Home page';

    constructor(
        private router: Router) {
    }

    ngOnInit() {
    }

    //gotoDetail(hero: Hero) {
    //    let link = ['/detail', hero.id];
    //    this.router.navigate(link);
    //}
}