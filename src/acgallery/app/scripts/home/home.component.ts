import { Component, OnInit }        from '@angular/core';
import { LoginService }             from '../login.service';

@Component({
    selector: 'my-app-home',
    templateUrl: 'app/views/home.html'
})

export class HomeComponent implements OnInit {
    constructor(public loginService: LoginService) {
    }

    ngOnInit() {
    }

    public onLogin() {
        console.log("Do login logic");
        this.loginService.Authorize();
    }

    public onLogout() {
        console.log("Do logout logic");
        this.loginService.Logoff();
    }
}