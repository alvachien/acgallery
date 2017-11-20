import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.authContent.subscribe(x => {
      this.isLoggedIn = x.isAuthorized;
    }, error => {
    }, () => {
      // Completed
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  private checkLogin(url: string): boolean {
    return this.isLoggedIn;
  }
}
