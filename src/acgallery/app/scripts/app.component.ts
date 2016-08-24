import { Component, OnInit }        from '@angular/core';
import { LoginService }             from './login.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/main.html'
})
export class AppComponent implements OnInit {
 
    constructor(public loginService: LoginService) {  
    }

    ngOnInit() {
        console.log("ngOnInit loginService.AuthorizedCallback");

        if (window.location.hash) {
            this.loginService.AuthorizedCallback();
        }
    } 
 }

