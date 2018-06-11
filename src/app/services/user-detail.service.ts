import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LogLevel, Photo, UpdPhoto, UserAuthInfo, UserDetail } from '../model';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserDetailService {
  private _usrdetail: UserDetail;
  private _infoLoaded: boolean;
  get InfoLoaded(): boolean {
    return this._infoLoaded;
  }
  get UserDetailInfo(): UserDetail {
    return this._usrdetail;
  }

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: Entering UserDetailService constructor...');
      }

      this._authService.authContent.subscribe((x: UserAuthInfo) => {
      if (!x.isAuthorized) {
        this._usrdetail = undefined;
        this._infoLoaded = false;
      }
    });
  }

  /**
   * Read detail ifno.
   */
  public readDetailInfo(): Observable<any> {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering method readDetailInfo of UserDetailService...');
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const apiurl = environment.UserDetailAPIUrl + '/' + this._authService.authSubject.getValue().getUserID();
    return this._http.get(apiurl, { headers: headers })
      .pipe(map((response: any) => {
        this._infoLoaded = true;

        this._usrdetail = new UserDetail();
        this._usrdetail.onSetData(response);
        return this._usrdetail;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error) {
          // Log the error?
        }

        this._infoLoaded = false;
        return of(undefined);
      }));
  }

  /**
   * Save detail info
   */
  public saveDetailInfo(usrInfo: UserDetail): Observable<any> {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering method saveDetailInfo of UserDetailService...');
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const jdata: any = JSON && JSON.stringify(usrInfo);

    if (this._infoLoaded) {
      // Change
      const apichgurl = environment.UserDetailAPIUrl + '/' + this._authService.authSubject.getValue().getUserID();
      return this._http.put(apichgurl, jdata, { headers: headers }).pipe(map((value: any) => {
        this._infoLoaded = true;
        this._usrdetail = usrInfo;
      }));
    } else {
      // Create
      return this._http.post(environment.UserDetailAPIUrl, jdata, { headers: headers }).pipe(map((value: any) => {
        this._infoLoaded = true;
        this._usrdetail = usrInfo;
      }));
    }
  }
}
