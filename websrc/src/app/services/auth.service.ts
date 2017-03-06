import { environment  }             from '../../environments/environment';
import { Injectable }               from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject }          from 'rxjs/BehaviorSubject';
import { Observable }               from 'rxjs/Observable';
import { UserInfo }                 from './user.service';
declare var Oidc: any;
//import * as Oidc                    from 'oidc-client';

@Injectable()
export class AuthService {
    public authSubject: BehaviorSubject<UserInfo> = new BehaviorSubject(new UserInfo());

    public authContent: Observable<UserInfo> = this.authSubject.asObservable();

    private mgr: any;
    
    constructor() {
       let settings = {
           authority: environment.IDServerUrl,
           client_id: "acgallery.app",
           redirect_uri: environment.ACGalleryCallback,
           response_type: "id_token token",
           scope: "openid profile api.galleryapi api.acgallery",
           post_logout_redirect_uri: environment.ACGalleryLogoutCallback
        };

       this.mgr = new Oidc.UserManager(settings);
       var that = this;
       this.mgr.getUser().then(function (u) {
           if (environment.DebugLogging) {
               console.log(u);
           }

            if (u) {
                that.authSubject.value.setContent(u);               
            }
            else {
                that.authSubject.value.cleanContent();
            }

            that.authSubject.next(that.authSubject.value);
        }, function (reason) {
        });

       this.mgr.events.addUserUnloaded((e) => {
           if (environment.DebugLogging) {
               console.log("user unloaded");
           }
           that.authSubject.value.cleanContent();

           that.authSubject.next(that.authSubject.value);
       });
    }

   public doLogin() {
       if (environment.DebugLogging) {
           console.log("Start the login...");
       }

       if (this.mgr) {
           this.mgr.signinRedirect().then(function () {
			    if (environment.DebugLogging) {
                   console.info("redirecting for login...");
			    }
           })
            .catch(function (er) {
                if (environment.DebugLogging) {
                    console.error("Sign-in error", er);
                }
            });
       }
    }

   public doLogout() {
       if (environment.DebugLogging) {
           console.log("Start the logout...");
       }

       if (this.mgr) {
           this.mgr.signoutRedirect().then(function () {
               if (environment.DebugLogging) {
                   console.info("redirecting for logout...");
               }
           })
            .catch(function (er) {
                if (environment.DebugLogging) {
                    console.error("Sign-out error", er);
                }
            });
       }
   }
}
