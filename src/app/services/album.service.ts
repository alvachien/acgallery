import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Album, Photo, AlbumPhotoLink, AlbumPhotoByAlbum, AlbumPhotoByPhoto } from '../model';
import { AuthService } from './auth.service';
import { Subject, Observable } from 'rxjs/Rx';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AlbumService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  public createAlbum(album: Album): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(album);

    return this._http.post(environment.AlbumAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public createAlbumPhotoLink(link: AlbumPhotoLink): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(link);

    return this._http.post(environment.AlbumPhotoLinkUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public updateAlbumPhotoByAlbum(apba: AlbumPhotoByAlbum): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(apba);

    return this._http.post(environment.AlbumPhotoByAlbumAPIUrl, data, { headers: headers, withCredentials: true });
  }

  public updateAlbumPhotoByPhoto(apbp: AlbumPhotoByPhoto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(apbp);

    return this._http.post(environment.AlbumPhotoByPhotoAPIUrl, data, { headers: headers, withCredentials: true });
  }

  public updateMetadata(album: Album): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(album);

    return this._http.put(environment.AlbumAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public loadAlbums(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.AlbumAPIUrl, { headers: headers, withCredentials: true })
        .map(response => <any>response);
    }

    return this._http.get(environment.AlbumAPIUrl, { headers: headers, withCredentials: false })
      .map(response => <any>response);
  }

  public loadAlbum(id: number | string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers, withCredentials: true })
        .map(response => <any>response);
    }

    return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers, withCredentials: false })
      .map(response => <any>response);
  }

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
      withCredentials: true
    })
    .map(response => <any>response);
  }
}
