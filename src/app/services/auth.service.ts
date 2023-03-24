import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ConsoleLogTypeEnum, UserAuthInfo, UserDetail, writeConsole } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authSubject: BehaviorSubject<UserAuthInfo> = new BehaviorSubject(new UserAuthInfo());
  public authContent: Observable<UserAuthInfo> = this.authSubject.asObservable();
  private _isUserDetailLoaded = false;
  private _userDetail: UserDetail | undefined = undefined;

  constructor(
    private http: HttpClient,
    private authService: OidcSecurityService,
    private eventService: PublicEventsService
  ) {
    writeConsole('ACGallery [Debug]: Entering AuthService constructor...', ConsoleLogTypeEnum.debug);

    this.eventService
      .registerForEvents()
      // .pipe(filter((notification) => notification.type === EventTypes.CheckSessionReceived))
      .subscribe((value) => {
        switch (value.type) {
          case EventTypes.CheckSessionReceived:
            writeConsole(
              'AC_HIH_UI [Debug]: Entering AuthService: Check session received...',
              ConsoleLogTypeEnum.debug
            );
            break;
          case EventTypes.ConfigLoaded:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: Config loaded...', ConsoleLogTypeEnum.debug);
            break;
          case EventTypes.ConfigLoadingFailed:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: Config loading failed...', ConsoleLogTypeEnum.debug);
            break;
          case EventTypes.UserDataChanged:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: User data changed...', ConsoleLogTypeEnum.debug);
            break;
          case EventTypes.NewAuthenticationResult:
            writeConsole(
              'AC_HIH_UI [Debug]: Entering AuthService: New authentication result...',
              ConsoleLogTypeEnum.debug
            );
            this.checkAuth();
            break;
          case EventTypes.TokenExpired:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: Token expired...', ConsoleLogTypeEnum.debug);
            break;
          case EventTypes.IdTokenExpired:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: ID token expired...', ConsoleLogTypeEnum.debug);
            break;
          case EventTypes.SilentRenewStarted:
            writeConsole('AC_HIH_UI [Debug]: Entering AuthService: Silent renew started...', ConsoleLogTypeEnum.debug);
            break;
          default:
            break;
        }
        writeConsole(
          `AC_HIH_UI [Debug]: Entering AuthService: CheckSessionChanged with value: ${value}`,
          ConsoleLogTypeEnum.debug
        );
      });

    this.checkAuth();
  }

  private checkAuth() {
    this.authService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      writeConsole(
        `AC_HIH_UI [Debug]: Entering AuthService checkAuth callback with 'IsAuthenticated' = ${isAuthenticated}.`,
        ConsoleLogTypeEnum.debug
      );
      if (isAuthenticated) {
        this.authSubject.value.setContent({
          userId: userData.sub,
          userName: userData.name,
          accessToken: accessToken,
        });
      } else {
        this.authSubject.value.cleanContent();
      }
    });
  }

  public doLogin() {
    writeConsole('ACGallery [Debug]: Entering AuthService logon...', ConsoleLogTypeEnum.debug);
    this.authService.authorize();
  }

  public doLogout() {
    writeConsole('ACGallery [Debug]: Entering AuthService doLogout...', ConsoleLogTypeEnum.debug);
    this.authService.logoffAndRevokeTokens().subscribe(() => {
      this.authSubject.value.cleanContent();
    });
  }

  public getUserDetail(forceReload = false): Observable<UserDetail> {
    if (!this._isUserDetailLoaded || forceReload) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers
        .append('Content-Type', 'application/json')
        .append('Accept', 'application/json')
        .append('Authorization', 'Bearer ' + this.authSubject.getValue().getAccessToken());
      const params: HttpParams = new HttpParams();
      const apiurl = `${environment.apiRootUrl}UserDetails('${this.authSubject.getValue().getUserId()}')`;

      return this.http
        .get(apiurl, {
          headers,
          params,
        })
        .pipe(
          map((response) => {
            this._userDetail = new UserDetail();
            this._userDetail.onSetData(response);
            this._userDetail.others = '';

            this._isUserDetailLoaded = true;

            return this._userDetail;
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error(error.statusText + '; ' + error.error + '; ' + error.message));
          })
        );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return of(this._userDetail!);
    }
  }
}
