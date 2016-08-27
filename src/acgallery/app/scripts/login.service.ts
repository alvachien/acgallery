import { IDServerUrl, ACGalleryCallback, ACGalleryLogoutCallback,
    ACGalleryHost, environment  }   from './app.setting';
import { Injectable }               from '@angular/core';
import { Http, Response, Headers }  from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable }               from 'rxjs/Observable';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
declare var Oidc: any;

@Injectable()
export class LoginService {

    //private actionUrl: string;
    private headers: Headers;
    //private storage: any;
    //private strIsAuthor: string = "IsAuthorized";
    private mgr: any;
    public IsAuthorized: boolean;
    public CurrentUser: any;

    constructor(private _http: Http, private _router: Router) {

        //this.actionUrl = _configuration.Server + 'api/DataEventRecords/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        //this.storage = localStorage;
        //if (this.retrieve("IsAuthorized") !== "") {
        //    this.IsAuthorized = this.retrieve(this.strIsAuthor);
        //}
        let settings = {
            authority: IDServerUrl,
            client_id: "acgallery.app",
            redirect_uri: ACGalleryCallback,
            response_type: "id_token token",
            scope: "openid profile api.hihapi"
        };

        this.mgr = new Oidc.UserManager(settings);
        this.mgr.getUser().then(function (u) {
            if (u) {
                this.CurrentUser = u;
                this.IsAuthorized = true;
            }
            else {
                //$log.info("no user loaded");
                this.CurrentUser = null;
                this.IsAuthorized = false;
            }
        });

        this.mgr.events.addUserUnloaded((e) => {
            if (environment === "Development") {
                console.log("user unloaded");
            }
            this.IsAuthorized = false;
            this.CurrentUser = null;
        });
    }


    //public GetToken(): any {
    //    return this.retrieve("authorizationData");
    //}

    //public ResetAuthorizationData() {
    //    this.store("authorizationData", "");
    //    this.store("authorizationDataIdToken", "");

    //    this.IsAuthorized = false;
    //    this.UserName = "";
    //    this.store(this.strIsAuthor, false);
    //}

    //public SetAuthorizationData(token: any, id_token: any) {
    //    if (this.retrieve("authorizationData") !== "") {
    //        this.store("authorizationData", "");
    //    }

    //    this.store("authorizationData", token);
    //    this.store("authorizationDataIdToken", id_token);
    //    this.IsAuthorized = true;
    //    this.store(this.strIsAuthor, true);

    //    var data: any = this.getDataFromToken(token);
    //    if (data.role && data.role.length > 0) {
    //        for (var i = 0; i < data.role.length; i++) {
    //            if (data.role[i] === "dataEventRecords.admin") {
    //            }
    //        }
    //    }
    //}

    public Authorize() {
        //this.ResetAuthorizationData();

        if (environment === "Development") {
            console.log("BEGIN Authorize, no auth data");
        }

        if (this.mgr) {
            this.mgr.signinRedirect().then(function () {
                console.info("redirecting for login...");
            })
            .catch(function (er) {
                console.error("Sign-in error", er);
            });
        }

        //var authorizationUrl = IDServerUrl + 'connect/authorize';
        ////var authorizationUrl = IDServerUrl;
        //var client_id = 'acgallery.app';
        //var redirect_uri = ACGalleryCallback;
        //var response_type = "id_token token";
        //var scope = "openid profile api.hihapi";
        //var nonce = "N" + Math.random() + "" + Date.now();
        //var state = Date.now() + "" + Math.random();

        //this.store("authStateControl", state);
        //this.store("authNonce", nonce);
        //if (environment === "Development") {
        //    console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));
        //}

        //var url =
        //    authorizationUrl + "?" +
        //    "response_type=" + encodeURI(response_type) + "&" +
        //    "client_id=" + encodeURI(client_id) + "&" +
        //    "redirect_uri=" + encodeURI(redirect_uri) + "&" +
        //    "scope=" + encodeURI(scope) + "&" +
        //    "nonce=" + encodeURI(nonce) + "&" +
        //    "state=" + encodeURI(state);

        //window.location.href = url;

        //$scope.mgr.getUser().then(function (u) {
        //    if (u) {
        //        $log.info("User loaded", u);
        //        $rootScope.User = u;
        //        $rootScope.isLoggedIn = true;
        //    }
        //    else {
        //        $log.info("no user loaded");
        //    }
        //});


    }

    public AuthorizedCallback() {
        //if (environment === "Development") {
        //    console.log("BEGIN AuthorizedCallback, no auth data");
        //}

        //if (this.mgr) {
        //    this.mgr.signinRedirectCallback().then(function (user) {
        //        if (user == null) {
        //            this.IsAuthorized = true;
        //            this.CurrentUser = null;
        //            //document.getElementById("waiting").style.display = "none";
        //            //document.getElementById("error").innerText = "No sign-in request pending.";
        //        }
        //        else {
        //            // Figure 
        //            this.IsAuthorized = true;
        //            this.CurrentUser = user;
        //            //window.location = "/index.html";
        //        }
        //    })
        //    .catch(function (er) {
        //        this.IsAuthorized = false;
        //        this.CurrentUser = null;
        //        //document.getElementById("waiting").style.display = "none";
        //        //document.getElementById("error").innerText = er.message;
        //    });
        //}

        //if (this.IsAuthorized) {
        //    this._router.navigate(['/home']);
        //} else {
        //    this._router.navigate(['/unauthorized']);
        //}

        ////this.ResetAuthorizationData();

        ////var hash = window.location.hash.substr(1);

        ////var result: any = hash.split('&').reduce(function (result, item) {
        ////    var parts = item.split('=');
        ////    result[parts[0]] = parts[1];
        ////    return result;
        ////}, {});

        ////if (environment === "Development") {
        ////    console.log(result);
        ////    console.log("AuthorizedCallback created, begin token validation");
        ////}

        ////var token = "";
        ////var id_token = "";
        ////var authResponseIsValid = false;
        ////if (!result.error) {

        ////    if (result.state !== this.retrieve("authStateControl")) {
        ////        if (environment === "Development") {
        ////            console.log("AuthorizedCallback incorrect state");
        ////        }
        ////    } else {

        ////        token = result.access_token;
        ////        id_token = result.id_token

        ////        var dataIdToken: any = this.getDataFromToken(id_token);
        ////        if (environment === "Development") {
        ////            console.log(dataIdToken);
        ////        }

        ////        // validate nonce
        ////        if (dataIdToken.nonce !== this.retrieve("authNonce")) {
        ////            if (environment === "Development") {
        ////                console.log("AuthorizedCallback incorrect nonce");
        ////            }
        ////        } else {
        ////            this.store("authNonce", "");
        ////            this.store("authStateControl", "");

        ////            authResponseIsValid = true;
        ////            if (environment === "Development") {
        ////                console.log("AuthorizedCallback state and nonce validated, returning access token");
        ////            }
        ////        }
        ////    }
        ////}

        ////if (authResponseIsValid) {
        ////    this.SetAuthorizationData(token, id_token);
        ////    if (environment === "Development") {
        ////        console.log(this.retrieve("authorizationData"));
        ////    }
        ////    this._router.navigate(['/home']);
        ////}
        ////else {
        ////    this.ResetAuthorizationData();
        ////    this._router.navigate(['/unauthorized']);
        ////}
    }

    public Logoff() {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        if (environment === "Development") {
            console.log("BEGIN Authorize, no auth data");
        }

        //var authorizationUrl = IDServerUrl + '/connect/endsession';

        //var id_token_hint = this.retrieve("authorizationDataIdToken");
        //var post_logout_redirect_uri = ACGalleryLogoutCallback;

        //var url =
        //    authorizationUrl + "?" +
        //    "id_token_hint=" + encodeURI(id_token_hint) + "&" +
        //    "post_logout_redirect_uri=" + encodeURI(post_logout_redirect_uri);

        //this.ResetAuthorizationData();

        //window.location.href = url;
    }

    public HandleError(error: any) {
        //console.log(error);
        //if (error.status == 403) {
        //    this._router.navigate(['/forbidden'])
        //}
        //else if (error.status == 401) {
        //    this.ResetAuthorizationData();
        //    this._router.navigate(['/unauthorized'])
        //}
    }

    private urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        return window.atob(output);
    }

    private getDataFromToken(token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        //var item = this.storage.getItem(key);

        //if (item && item !== 'undefined') {
        //    return JSON.parse(this.storage.getItem(key));
        //}

        //return;
    }

    private store(key: string, value: any) {
        //this.storage.setItem(key, JSON.stringify(value));
    }
}
