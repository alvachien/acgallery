import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Album, AlbumPhotoLink, AlbumPhotoByAlbum, AlbumPhotoByPhoto } from '../model/album';
import { Photo } from '../model/photo';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
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

    let data = JSON && JSON.stringify(album);

    return this._http.post(environment.AlbumAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public createAlbumPhotoLink(link: AlbumPhotoLink): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(link);

    return this._http.post(environment.AlbumPhotoLinkUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public updateAlbumPhotoByAlbum(apba: AlbumPhotoByAlbum): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(apba);

    return this._http.post(environment.AlbumPhotoByAlbumAPIUrl, data, { headers: headers, withCredentials: true });
  }

  public updateAlbumPhotoByPhoto(apbp: AlbumPhotoByPhoto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(apbp);

    return this._http.post(environment.AlbumPhotoByPhotoAPIUrl, data, { headers: headers, withCredentials: true });
  }

  public updateMetadata(album: Album): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(album);

    return this._http.put(environment.AlbumAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public loadAlbums() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.get(environment.AlbumAPIUrl, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public loadAlbum(id: number | string) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers, withCredentials: true })
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
