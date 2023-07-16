import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogLevel } from '../models';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  canActivateChild(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    childRoute: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkLogin(url: string): true | false | UrlTree {
    if (this.authService.authSubject.getValue().isAuthorized) {
      if (environment.loggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: entering checkLogin of AuthGuard with TRUE');
      }
      return true;
    }

    // For ACGallery: we cannot store the attempted URL because the whole page will be reloaded.
    // Store the attempted URL for redirecting
    // this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    if (environment.loggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: entering checkLogin of AuthGuard with FALSE, therefore redirecting...');
    }
    this.authService.doLogin();

    // Redirect to the login page
    return false;
  }
}
