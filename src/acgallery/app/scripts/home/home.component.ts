import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app-home',
    templateUrl: 'app/views/home.html'
})

export class HomeComponent implements OnInit {
    ngOnInit() {
    }

    //gotoDetail(hero: Hero) {
    //    let link = ['/detail', hero.id];
    //    this.router.navigate(link);
    //}
}