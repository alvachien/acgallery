import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app-about',
    templateUrl: 'app/views/about.html',
    providers: [
    ]
})
export class AboutComponent implements OnInit {
    title = 'About';

    constructor(
        private router: Router) {
    }

    ngOnInit() {
    }

}