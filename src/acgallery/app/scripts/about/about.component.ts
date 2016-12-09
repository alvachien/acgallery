import { Component, OnInit, OnDestroy } from '@angular/core';
import { DebugLogging } from '../app.setting';

@Component({
    selector: 'acgallery-app-about',
    templateUrl: 'app/views/about.html'
})
export class AboutComponent implements OnInit {
    constructor() {
        if (DebugLogging) {
            console.log("Entering constructor of AboutComponent");
        }
    }

    ngOnInit() {
        if (DebugLogging) {
            console.log("Entering ngOnInit of AboutComponent");
        }
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of AboutComponent");
        }

    }
}