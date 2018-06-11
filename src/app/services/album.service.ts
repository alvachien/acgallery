import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Album, Photo, AlbumPhotoLink, AlbumPhotoByAlbum, AlbumPhotoByPhoto } from '../model';
import { AuthService } from './auth.service';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AlbumService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
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
  public loadAlbums(top?: number, skip?: number): Observable<any> {
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

    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.AlbumAPIUrl, { headers: headers, params: params });
    }

    return this._http.get(environment.AlbumAPIUrl, { headers: headers, params: params });
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
}
