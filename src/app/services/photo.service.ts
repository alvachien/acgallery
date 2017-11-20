import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Album, AlbumPhotoLink } from '../model/album';
import { Photo } from '../model/photo';
import { AuthService } from './auth.service';

@Injectable()
export class PhotoService {

  constructor(private _http: Http,
    private _authService: AuthService) {
  }

  public updateFileMetadata(photo: Photo): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    var data = JSON && JSON.stringify(photo);

    return this._http.put(environment.PhotoAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public createFile(fileRecord: any): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    var data = JSON && JSON.stringify(fileRecord);

    return this._http.post(environment.PhotoAPIUrl, data, { headers: headers })
      .map(response => response.json());
  }

  public uploadFile(params: string[], files: File[]) {
    let formData: FormData = new FormData(),
      xhr: XMLHttpRequest = new XMLHttpRequest();

    for (let i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // let respObj = JSON.parse(xhr.response);
          // this._upload$.next(respObj);
          // this._upload$.complete();
        } else {
          // this._upload$.error(xhr.response);
        }
      }
    };

    xhr.upload.onprogress = (event) => {
      // this.progress = Math.round(event.loaded / event.total * 100);

      // this._uploadprog$.next(this.progress);
      // if (this.progress == 100)
      //   this._uploadprog$.complete();
    };

    xhr.open('POST', environment.PhotoAPIUrl, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    xhr.send(formData);
  }

  public loadPhotos(paramString?: string): Observable<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized)
      headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let apistring = environment.PhotoAPIUrl;
    if (paramString) {
      apistring += paramString;
    }

    return this._http.get(apistring, { headers: headers })
      .map(response => response.json());
  }

  public loadAlbumPhoto(albumid: string | number, accesscode?: string): Observable<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized)
      headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: URLSearchParams = new URLSearchParams();
    params.set('albumid', albumid.toString());
    if (accesscode) {
      params.set('accesscode', accesscode);
    }

    return this._http.get(environment.PhotoAPIUrl, { search: params, headers: headers })
      .map(response => response.json());
  }
}
