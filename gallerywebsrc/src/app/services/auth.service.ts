import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LogLevel } from '../model/common';
import { UserAuthInfo } from '../model/userinfo';
import { UserManager, Log, MetadataService, User } from 'oidc-client';

@Injectable()
export class AuthService {
  public authSubject: BehaviorSubject<UserAuthInfo> = new BehaviorSubject(new UserAuthInfo());
  public authContent: Observable<UserAuthInfo> = this.authSubject.asObservable();
  private mgr: UserManager;
  private authHeaders: Headers;
  public userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor(
    private http: Http
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery Log [Debug]: Entering AuthService constructor...");
    }

    this.mgr = new UserManager(AuthSettings);

    let that = this;
    this.mgr.getUser().then(function (u) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log("ACGallery Log [Debug]: AuthService constructor, user get successfully as following: ");
        console.log(u);
      }

      if (u) {
        that.authSubject.value.setContent(u);

        // Broadcast event
        that.userLoadededEvent.emit(u);
      }
      else {
        that.authSubject.value.cleanContent();
      }

      that.authSubject.next(that.authSubject.value);
    }, function (reason) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log("ACGallery Log [Error]: AuthService failed to fetch user:");
        console.log(reason);
      }
    });

    this.mgr.events.addUserUnloaded((e) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log("ACGallery Log [Debug]: User unloaded");
      }
      that.authSubject.value.cleanContent();

      that.authSubject.next(that.authSubject.value);
    });

    this.mgr.events.addAccessTokenExpiring(function () {
      console.log("token expiring");
    });
    this.mgr.events.addAccessTokenExpired(function () {
      console.log("token expired");
    });
  }

  public doLogin() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery Log [Debug]: Start the login...");
    }

    if (this.mgr) {
      this.mgr.signinRedirect().then(function () {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info("ACGallery Log [Debug]: Redirecting for login...");
        }
      })
        .catch(function (er) {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error("ACGallery Log [Error]: Sign-in error", er);
          }
        });
    }
  }

  public doLogout() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery Log [Debug]: Start the logout...");
    }

    if (this.mgr) {
      this.mgr.signoutRedirect().then(function () {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info("ACGallery Log [Debug]: redirecting for logout...");
        }
      })
        .catch(function (er) {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error("ACGallery Log [Error]: Sign-out error", er);
          }
        });
    }
  }

  clearState() {
    this.mgr.clearStaleState().then(function () {
      console.log("clearStateState success");
    }).catch(function (e) {
      console.log("clearStateState error", e.message);
    });
  }

  getUser() {
    this.mgr.getUser().then((user) => {
      console.log("got user", user);
      this.userLoadededEvent.emit(user);
    }).catch(function (err) {
      console.log(err);
    });
  }

  removeUser() {
    this.mgr.removeUser().then(() => {
      this.userLoadededEvent.emit(null);
      console.log("user removed");
    }).catch(function (err) {
      console.log(err);
    });
  }

  startSigninMainWindow() {
    this.mgr.signinRedirect({ data: 'some data' }).then(function () {
      console.log("signinRedirect done");
    }).catch(function (err) {
      console.log(err);
    });
  }
  
  endSigninMainWindow() {
    this.mgr.signinRedirectCallback().then(function (user) {
      console.log("signed in", user);
    }).catch(function (err) {
      console.log(err);
    });
  }

  startSignoutMainWindow() {
    this.mgr.signoutRedirect().then(function (resp) {
      console.log("signed out", resp);
      setTimeout(5000, () => {
        console.log("testing to see if fired...");

      })
    }).catch(function (err) {
      console.log(err);
    });
  };

  endSignoutMainWindow() {
    this.mgr.signoutRedirectCallback().then(function (resp) {
      console.log("signed out", resp);
    }).catch(function (err) {
      console.log(err);
    });
  };

  /**
   * Example of how you can make auth request using angulars http methods.
   * @param options if options are not supplied the default content type is application/json
   */
  AuthGet(url: string, options?: RequestOptions): Observable<Response> {
    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.get(url, options);
  }

  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    let body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.put(url, body, options);
  }

  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.delete(url, options);
  }

  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

    let body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.post(url, body, options);
  }

  private _setAuthHeaders(user: any) {
    this.authHeaders = new Headers();
    this.authHeaders.append('Authorization', user.token_type + " " + user.access_token);
    this.authHeaders.append('Content-Type', 'application/json');
  }

  private _setRequestOptions(options?: RequestOptions) {

    if (options) {
      options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
    }
    else {
      options = new RequestOptions({ headers: this.authHeaders, body: "" });
    }

    return options;
  }
}

const AuthSettings: any = {
  authority: environment.IDServerUrl,
  client_id: "acgallery.app",
  redirect_uri: environment.AppLoginCallbackUrl,
  post_logout_redirect_uri: environment.AppLogoutCallbackUrl,
  response_type: "id_token token",
  scope: "openid profile api.acgallery api.galleryapi",

  silent_redirect_uri: environment.AppLoginCallbackUrl,
  automaticSilentRenew: true,
  //silentRequestTimeout:10000,

  filterProtocolClaims: true,
  loadUserInfo: true
};
