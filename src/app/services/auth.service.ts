import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { LogLevel } from '../model/common';
import { UserAuthInfo } from '../model/userinfo';
import { UserManager, Log, MetadataService, User } from 'oidc-client';

const AuthSettings: any = {
  authority: environment.IDServerUrl,
  client_id: 'acgallery.app',
  redirect_uri: environment.AppLoginCallbackUrl,
  post_logout_redirect_uri: environment.AppLogoutCallbackUrl,
  response_type: 'id_token token',
  scope: 'openid profile api.galleryapi',

  silent_redirect_uri: environment.AppLoginCallbackUrl,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 4,
  // silentRequestTimeout:10000,

  filterProtocolClaims: true,
  loadUserInfo: true,
};

@Injectable()
export class AuthService {
  public authSubject: BehaviorSubject<UserAuthInfo> = new BehaviorSubject(new UserAuthInfo());
  public authContent: Observable<UserAuthInfo> = this.authSubject.asObservable();
  private mgr: UserManager;
  public userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AuthService constructor...');
    }

    this.mgr = new UserManager(AuthSettings);

    let that = this;
    this.mgr.getUser().then(function (u) {
      if (u) {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`ACGallery [Debug]: AuthService constructor, user get successfully: ${u}`);
        }

        // Set the content
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
        console.error(`ACGallery [Error]: AuthService failed to fetch user: ${reason}`);
      }
    });

    this.mgr.events.addUserUnloaded((e) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: User unloaded');
      }
      that.authSubject.value.cleanContent();

      that.authSubject.next(that.authSubject.value);
    });

    this.mgr.events.addAccessTokenExpiring(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.warn('ACGallery [Warn]: token expiring');
      }
    });

    this.mgr.events.addAccessTokenExpired(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.warn('ACGallery [Warn]: token expired');
      }

      that.doLogin();
    });
  }

  public doLogin() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Start the login...');
    }

    if (this.mgr) {
      this.mgr.signinRedirect().then(function () {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info('ACGallery [Debug]: Redirecting for login...');
        }
      })
      .catch(function (er) {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`ACGallery [Error]: Sign-in error: ${er}`);
        }
      });
    }
  }

  public doLogout() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Start the logout...');
    }

    if (this.mgr) {
      this.mgr.signoutRedirect().then(function () {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info('ACGallery [Debug]: redirecting for logout...');
        }
      })
      .catch(function (er) {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`ACGallery [Error]: Sign-out error: ${er}`);
        }
      });
    }
  }

  clearState() {
    this.mgr.clearStaleState().then(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: clearStateState success');
      }
    }).catch(function (e) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: clearStateState error: ${e}`);
      }
    });
  }

  getUser() {
    this.mgr.getUser().then((user) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: got user: ${user}`);
      }

      this.userLoadededEvent.emit(user);
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: getUser error: ${err}`);
      }
    });
  }

  removeUser() {
    this.mgr.removeUser().then(() => {
      this.userLoadededEvent.emit(null);
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: user removed');
      }
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: removeUser error: ${err}`);
      }
    });
  }

  startSigninMainWindow() {
    this.mgr.signinRedirect({ data: 'some data' }).then(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: signinRedirect done');
      }
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: startSigninMainWindow error: ${err}`);
      }
    });
  }

  endSigninMainWindow() {
    this.mgr.signinRedirectCallback().then(function (user) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: signed in: ${user}`);
      }
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: startSigninMainWindow error: ${err}`);
      }
    });
  }

  startSignoutMainWindow() {
    this.mgr.signoutRedirect().then(function (resp) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: signed out: ${resp}`);
      }
      setTimeout(() => {
        console.log('ACGallery [Debug]: testing to see if fired...');
      }, 5000);
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: startSignoutMainWindow error: ${err}`);
      }
    });
  }

  endSignoutMainWindow() {
    this.mgr.signoutRedirectCallback().then(function (resp) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: signed out: ${resp}`);
      }
    }).catch(function (err) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: endSignoutMainWindow error: ${err}`);
      }
    });
  }
}
