import { Component, OnInit }        from '@angular/core';
import { LoginService }             from './login.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/main.html'
})
export class AppComponent implements OnInit {

    public isLoggedIn: boolean;
    public titleLogin: string;

    constructor(public loginService: LoginService) {
        this.isLoggedIn = false;
        this.titleLogin = 'Log In';
    }

    ngOnInit() {
        //if (this.loginService.CurrentUser) {
        //    this.loginService.IsAuthorized = true;
        //} else {
        //    $scope.mgr.getUser().then(function (u) {
        //        if (u) {
        //            $log.info("User loaded", u);
        //            $rootScope.User = u;
        //            $rootScope.isLoggedIn = true;
        //        }
        //        else {
        //            $log.info("no user loaded");
        //        }
        //    });
        //}

        //console.log("ngOnInit loginService.AuthorizedCallback");

        //if (window.location.hash) {
        //    this.loginService.AuthorizedCallback();
        //}

        this.isLoggedIn = this.loginService.IsAuthorized;
        if (this.isLoggedIn) {
            //this.titleLogin = this.loginService.CurrentUser;
        }
    }

    public onLogin() {
        if (this.loginService.IsAuthorized) {
            this.doLogout();
        } else {
            this.doLogin();
        }
    }

    private doLogin() {
        console.log("Do login logic");
        this.loginService.Authorize();
    }

    private doLogout() {
        console.log("Do logout logic");
        this.loginService.Logoff();
    }
}

