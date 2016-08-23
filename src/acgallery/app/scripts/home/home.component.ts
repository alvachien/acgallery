import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app-home',
    templateUrl: 'app/views/home.html'
})

export class HomeComponent implements OnInit {
    ngOnInit() {
    }

    onLogin() {
        window["oidcmgr"].signinRedirect().then(function () {
            //log("redirecting for login...");
            console.log("Redirecting for login...");
        })
        .catch(function (er) {
           //log("Sign-in error", er);
            console.log("Sign-in error");
        });
    }
    //gotoDetail(hero: Hero) {
    //    let link = ['/detail', hero.id];
    //    this.router.navigate(link);
    //}
}