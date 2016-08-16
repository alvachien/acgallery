import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/main.html'
})
export class AppComponent {
    title = 'AC Photo Gallery';
}

//export const environment: string = 'Development';
export const environment: string = 'Productive';