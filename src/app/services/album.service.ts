import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Album, Photo, AlbumPhotoLink, AlbumPhotoByAlbum, AlbumPhotoByPhoto } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AlbumService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  /**
   * Load key figures
   */
  public loadKeyFigures(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    return this._http.get(environment.StatisticsAPIUrl, {headers: headers});
  }

  /**
   * Create an album
   * @param album Album to be created
   */
  public createAlbum(album: Album): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(album);

    return this._http.post(environment.AlbumAPIUrl, data, { headers: headers });
  }

  public createAlbumPhotoLink(link: AlbumPhotoLink): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(link);

    return this._http.post(environment.AlbumPhotoLinkUrl, data, { headers: headers });
  }

  public updateAlbumPhotoByAlbum(apba: AlbumPhotoByAlbum): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(apba);

    return this._http.post(environment.AlbumPhotoByAlbumAPIUrl, data, { headers: headers });
  }

  public updateAlbumPhotoByPhoto(apbp: AlbumPhotoByPhoto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(apbp);

    return this._http.post(environment.AlbumPhotoByPhotoAPIUrl, data, { headers: headers });
  }

  /**
   * Update specified album's metadata
   * @param album Album to be updated
   */
  public updateMetadata(album: Album): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(album);

    return this._http.put(environment.AlbumAPIUrl, data, { headers: headers });
  }

  /**
   * Load all albums which current user can see.
   */
  public loadAlbums(top?: number, skip?: number): Observable<Album[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    if (top) {
      params = params.append('top', top.toString());
    }
    if (skip) {
      params = params.append('skip', skip.toString());
    }

    let req: any;
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      req = this._http.get(environment.AlbumAPIUrl, { headers: headers, params: params });
    }

    req = this._http.get(environment.AlbumAPIUrl, { headers: headers, params: params });

    return req.pipe(map((response: HttpResponse<any>) => {
      let listAlbum: Album[] = [];
      let resdata: any = <any>response;
      if (resdata && resdata.contentList) {
        for (const alb of resdata.contentList) {
          const album = new Album();
          album.initex(alb);

          listAlbum.push(album);
        }
      }

      return listAlbum;
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
    }));
  }

  /**
   * Load specified Album ID
   * @param id ID of the specified album
   */
  public loadAlbum(id: number | string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers });
    }

    return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers });
  }

  /**
   * Load albums which contains specified photo
   * @param photoid ID of Photo
   */
  public loadAlbumContainsPhoto(photoid: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let params: HttpParams = new HttpParams();
    params = params.append('photoid', photoid);

    return this._http.get(environment.AlbumAPIUrl, {
      headers: headers,
      params: params,
    });
  }

  /**
   * Delete Album by its ID
   * @param id ID of the specified album
   */
  public deleteAlbum(id: number | string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.delete(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers });
  }
}
