import { IDServerUrl, ACGalleryCallback, ACGalleryLogoutCallback,
    ACGalleryHost, environment  }   from './app.setting';
import { Injectable }               from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject }          from 'rxjs/BehaviorSubject';
import { Observable }               from 'rxjs/Observable';
declare var Oidc: any;

export class AuthContent {
    public isAuthorized: boolean;
    private currentUser: any;

    public cleanContent() {
        this.currentUser = null;
        this.isAuthorized = false;
    }
    public setContent(user) {
        if (user) {
            this.currentUser = user;
            this.isAuthorized = true;
        } else {
            this.cleanContent();
        }
    }

    public getUserName(): string {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.name) {
            return this.currentUser.profile.name;
        }

        return "";
    }
    public getUserMaxUploadKBSize(): number {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.GalleryPhotoUploadMaxSize) {
            return +this.currentUser.profile.GalleryPhotoUploadMaxSize;
        }

        return 0;        
    }
    public getUserMinUploadKBSize(): number {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.GalleryPhotoUploadMinSize) {
            return +this.currentUser.profile.GalleryPhotoUploadMinSize;
        }

        return 0;
    }
}

@Injectable()
export class AuthService {
    private _authContent: BehaviorSubject<AuthContent> = new BehaviorSubject(new AuthContent());

    public authContent: Observable<AuthContent> = this._authContent.asObservable();

    private mgr: any;

   constructor() {
       let settings = {
           authority: IDServerUrl,
           client_id: "acgallery.app",
           redirect_uri: ACGalleryCallback,
           response_type: "id_token token",
           scope: "openid profile api.hihapi"
       };

       this.mgr = new Oidc.UserManager(settings);
       var that = this;
       this.mgr.getUser().then(function (u) {
           if (u) {
               that._authContent.value.setContent(u);               
           }
           else {
               that._authContent.value.cleanContent();
           }

           that._authContent.next(that._authContent.value);
       });

       this.mgr.events.addUserUnloaded((e) => {
           if (environment === "Development") {
               console.log("user unloaded");
           }
           that._authContent.value.cleanContent();

           that._authContent.next(that._authContent.value);
       });
    }

   public Login() {
       if (environment === "Development") {
           console.log("Start the login...");
       }

       if (this.mgr) {
           this.mgr.signinRedirect().then(function () {
               console.info("redirecting for login...");
           })
            .catch(function (er) {
                console.error("Sign-in error", er);
            });
       }
   }
}
