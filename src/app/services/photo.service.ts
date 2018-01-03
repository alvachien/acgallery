import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import { Album, Photo, AlbumPhotoLink } from '../model';
import { AuthService } from './auth.service';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PhotoService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  public updateFileMetadata(photo: Photo): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(photo);

    return this._http.put(environment.PhotoAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public createFile(fileRecord: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(fileRecord);

    return this._http.post(environment.PhotoAPIUrl, data, { headers: headers, withCredentials: true })
      .map(response => <any>response);
  }

  public uploadFile(params: string[], files: File[]) {
    const formData: FormData = new FormData(),
      xhr: XMLHttpRequest = new XMLHttpRequest();

    for (let i = 0; i < files.length; i++) {
      formData.append('uploads[]', files[i], files[i].name);
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
    let apistring = environment.PhotoAPIUrl;
    if (paramString) {
      apistring += paramString;
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(apistring, { headers: headers, withCredentials: true })
        .map(response => <any>response);
    }

    return this._http.get(apistring, { headers: headers })
      .map(response => <any>response);
  }

  public loadAlbumPhoto(albumid: string | number, accesscode?: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('albumid', albumid.toString());
    if (accesscode) {
      params = params.append('accesscode', accesscode);
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.PhotoAPIUrl, {
        headers: headers,
        params: params,
        withCredentials: true })
        .map(response => <any>response);
    }

    return this._http.get(environment.PhotoAPIUrl, {
      headers: headers,
      params: params,
      withCredentials: false
     }).map(response => <any>response);
  }

  public updatePhoto(pto: Photo): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const jdata: string = JSON && JSON.stringify(pto);
    return this._http.put(environment.PhotoAPIUrl, jdata, {
      headers: headers,
      withCredentials: true })
      .map(response => <any>response);
  }
}
