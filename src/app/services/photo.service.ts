import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    return this._http.put(environment.PhotoAPIUrl, data, { headers: headers });
  }

  public createFile(fileRecord: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = JSON && JSON.stringify(fileRecord);

    return this._http.post(environment.PhotoAPIUrl, data, { headers: headers });
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

  /**
   * Load the photos
   * @param top Maximum number of photo to fetch
   * @param skip Skip the number of photo
   */
  public loadPhotos(top?: number, skip?: number): Observable<any> {
    const apistring = environment.PhotoAPIUrl;
    let params: HttpParams = new HttpParams();
    if (top) {
      params = params.append('top', top.toString());
    }
    if (skip) {
      params = params.append('skip', skip.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(apistring, { headers: headers, params: params });
    }

    return this._http.get(apistring, { headers: headers, params: params });
  }

  /**
   * Load photos for specified album
   * @param albumid ID of album
   * @param accesscode Access code
   * @param top Maximum amount of the photo to fetch
   * @param skip The amount to skip in the result
   */
  public loadAlbumPhoto(albumid: string | number, accesscode?: string, top?: number, skip?: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('albumid', albumid.toString());
    if (accesscode) {
      params = params.append('accesscode', accesscode);
    }
    if (top) {
      params = params.append('top', top.toString());
    }
    if (skip) {
      params = params.append('skip', skip.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    if (this._authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(environment.PhotoAPIUrl, {
        headers: headers,
        params: params });
    }

    return this._http.get(environment.PhotoAPIUrl, {
        headers: headers,
        params: params,
      });
  }

  /**
   * Update the photo's info
   * @param pto Specified photo
   */
  public updatePhoto(pto: Photo): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const jdata: string = JSON && JSON.stringify(pto);
    return this._http.put(environment.PhotoAPIUrl, jdata, {
      headers: headers });
  }
}
