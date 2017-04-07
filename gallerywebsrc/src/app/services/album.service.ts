import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Album, AlbumPhotoLink, AlbumPhotoByAlbum, AlbumPhotoByPhoto } from '../model/album';
import { Photo } from '../model/photo';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlbumService {

  constructor(private _http: Http,
    private _authService: AuthService) {
  }

  public createAlbum(album: Album): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(album);

    return this._http.post(environment.AlbumAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public createAlbumPhotoLink(link: AlbumPhotoLink): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(link);

    return this._http.post(environment.AlbumPhotoLinkUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public updateAlbumPhotoByAlbum(apba: AlbumPhotoByAlbum): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(apba);

    return this._http.post(environment.AlbumPhotoByAlbumAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public updateAlbumPhotoByPhoto(apbp: AlbumPhotoByPhoto): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(apbp);

    return this._http.post(environment.AlbumPhotoByPhotoAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public updateMetadata(album: Album): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let data = JSON && JSON.stringify(album);

    return this._http.put(environment.AlbumAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public loadAlbums() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized)
      headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.get(environment.AlbumAPIUrl, { headers: headers })
      .map(response => response.json());
  }

  public loadAlbum(id: number | string) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized)
      headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.get(environment.AlbumAPIUrl + '/' + id.toString(), { headers: headers })
      .map(response => response.json());
  }
}
