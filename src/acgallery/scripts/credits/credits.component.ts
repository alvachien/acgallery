import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'my-app-credits',
    templateUrl: 'app/views/credits.html',
    providers: [
    ]
})
export class CreditsComponent implements OnInit {
    title = 'About';

    constructor(
        private router: Router) {
    }

    ngOnInit() {
    }

}