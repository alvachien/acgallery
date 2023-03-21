import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SequenceList } from 'actslib';

import { environment } from 'src/environments/environment';
import { Album, AlbumPhotoLink, Photo } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OdataService {
  apiUrl = `${environment.apiRootUrl}`;

  private isMetadataLoaded = false;
  private metadataInfo = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getMetadata(forceReload?: boolean): Observable<any> {
    if (!this.isMetadataLoaded || forceReload) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers
        .append('Content-Type', 'application/xml,application/json')
        .append('Accept', 'text/html,application/xhtml+xml,application/xml');

      let metadataurl = `${this.apiUrl}$metadata`;
      if (environment.mockdata) {
        metadataurl = `${environment.basehref}assets/mockdata/metadata.xml`;
      }
      return this.http
        .get(metadataurl, {
          headers,
          responseType: 'text',
        })
        .pipe(
          map(() => {
            this.isMetadataLoaded = true;
            // this.metadataInfo = response as unknown as string;
            this.metadataInfo = 'OData metadata';
            return this.metadataInfo;
          }),
          catchError((error: HttpErrorResponse) =>
            throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message))
          )
        );
    } else {
      return of(this.metadataInfo);
    }
  }

  ///
  /// Albums
  ///
  public getAlbums(skip = 0, top = 20): Observable<{ totalCount: number; items: SequenceList<Album> }> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    if (this.authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    }

    let params: HttpParams = new HttpParams();
    params = params.append('$top', top.toString());
    params = params.append('$skip', skip.toString());
    params = params.append('$count', 'true');
    const apiurl = `${this.apiUrl}Albums`;

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ritems = rjs.value as any[];
          const items: SequenceList<Album> = new SequenceList<Album>();

          for (const item of ritems) {
            const rit: Album = new Album();
            rit.parseData(item);
            items.AppendElement(rit);
          }

          return {
            totalCount: rjs['@odata.count'],
            items: items,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  public createAlbum(alb: Album): Observable<Album> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const apiurl = `${this.apiUrl}Albums`;
    const jdata = alb.writeJSONString();
    return this.http
      .post(apiurl, jdata, {
        headers,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          const alb2 = new Album();
          alb2.parseData(rjs);
          return alb2;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  public readAlbum(albumid: number): Observable<Album> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    if (this.authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    }

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}Albums(${albumid})`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          const rit: Album = new Album();
          rit.parseData(rjs);
          return rit;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  public getAlbumRelatedPhotos(
    albumid: number,
    accessCode?: string,
    skip = 0,
    top = 20
  ): Observable<{ totalCount: number; items: SequenceList<Photo> }> {
    // https://localhost:25325/Albums/GetPhotos(2005)?$count=true&$top=3
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    if (this.authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    }

    let params: HttpParams = new HttpParams();
    params = params.append('$count', 'true');
    params = params.append('$skip', skip.toString());
    params = params.append('$top', top.toString());
    params = params.append('$expand', 'Tags');
    let apiurl = '';
    if (accessCode) {
      apiurl = `${this.apiUrl}Albums/GetPhotos(AlbumID=${albumid},AccessCode='${accessCode}')`;
    } else {
      apiurl = `${this.apiUrl}Albums/GetPhotos(AlbumID=${albumid},AccessCode='')`;
    }
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ritems = rjs.value as any[];
          const items: SequenceList<Photo> = new SequenceList<Photo>();

          for (const item of ritems) {
            const rit: Photo = new Photo();
            rit.parseData(item);
            items.AppendElement(rit);
          }

          // if (environment.mockdata) {
          //   this.mockedKnowledgeItem = items.slice();
          // }

          return {
            totalCount: rjs['@odata.count'],
            items: items,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // Photos
  public getPhotos(
    skip = 0,
    top = 20,
    filter?: string
  ): Observable<{ totalCount: number; items: SequenceList<Photo> }> {
    // TBD.
    // if (environment.mockdata && this.mockedKnowledgeItem.length > 0) {
    //   return of({
    //     totalCount: this.mockedKnowledgeItem.length,
    //     items: this.mockedKnowledgeItem
    //   });
    // }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    if (this.authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    }

    let params: HttpParams = new HttpParams();
    params = params.append('$top', top.toString());
    params = params.append('$skip', skip.toString());
    params = params.append('$count', 'true');
    params = params.append('$select', 'PhotoId,Title,Desp,FileUrl,ThumbnailFileUrl,IsPublic');
    params = params.append('$expand', 'Tags');
    if (filter) {
      params = params.append('$filter', filter);
    }
    const apiurl = `${this.apiUrl}Photos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ritems = rjs.value as any[];
          const items: SequenceList<Photo> = new SequenceList<Photo>();

          for (const item of ritems) {
            const rit: Photo = new Photo();
            rit.parseData(item);
            items.AppendElement(rit);
          }

          // if (environment.mockdata) {
          //   this.mockedKnowledgeItem = items.slice();
          // }

          return {
            totalCount: rjs['@odata.count'],
            items: items,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getPhotoEXIF(phtId: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    params = params.append('$select', 'PhotoId,CameraMaker,CameraModel,LensModel,AVNumber,ShutterSpeed,ISONumber');
    const apiurl = `${this.apiUrl}Photos('${phtId}')`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          // if (environment.mockdata) {
          //   this.mockedKnowledgeItem = items.slice();
          // }

          return {
            CameraMaker: rjs['CameraMaker'],
            CameraModel: rjs['CameraModel'],
            LensModel: rjs['LensModel'],
            AVNumber: rjs['AVNumber'],
            ShutterSpeed: rjs['ShutterSpeed'],
            ISONumber: rjs['ISONumber'],
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  public searchPhotos(
    skip = 0,
    top = 20,
    filter?: string,
    albumId?: number,
    accessCode?: string
  ): Observable<{ totalCount: number; items: SequenceList<Photo> }> {
    // TBD.
    // if (environment.mockdata && this.mockedKnowledgeItem.length > 0) {
    //   return of({
    //     totalCount: this.mockedKnowledgeItem.length,
    //     items: this.mockedKnowledgeItem
    //   });
    // }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    if (this.authService.authSubject.getValue().isAuthorized) {
      headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    }

    let params: HttpParams = new HttpParams();
    params = params.append('$top', top.toString());
    params = params.append('$skip', skip.toString());
    params = params.append('$count', 'true');
    params = params.append('$select', 'PhotoId,Title,Desp,FileUrl,ThumbnailFileUrl,IsPublic');
    if (filter) {
      params = params.append('$filter', filter);
    }
    let apiurl = `${this.apiUrl}PhotoViews`;
    if (albumId) {
      apiurl = `${apiurl}/SearchPhotoInAlbum(AlbumID=${albumId},AccessCode='${accessCode ? accessCode : ''}')`;
    }

    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ritems = rjs.value as any[];
          const items: SequenceList<Photo> = new SequenceList<Photo>();

          for (const item of ritems) {
            const rit: Photo = new Photo();
            rit.parseData(item);
            items.AppendElement(rit);
          }

          // if (environment.mockdata) {
          //   this.mockedKnowledgeItem = items.slice();
          // }

          return {
            totalCount: rjs['@odata.count'],
            items: items,
          };
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  public createPhoto(pto: Photo): Observable<Photo> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}Photos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    const odata = pto.generateJson();
    return this.http
      .post(apiurl, odata, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          const pto2 = new Photo();
          pto2.parseData(rjs);

          return pto2;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // Change photo
  public changePhoto(pto: Photo): Observable<Photo> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}Photos('${pto.photoId}')`;

    const odata = pto.generateJson();
    return this.http
      .put(apiurl, odata, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          const pto2 = new Photo();
          pto2.parseData(rjs);

          return pto2;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // Change photo via patch
  public changePhotoInfo(
    photoId: string,
    title: string,
    desp: string,
    ispublic: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}Photos('${photoId}')`;

    // Replace
    const content = {
      Title: title,
      Desp: desp,
      IsPublic: ispublic,
    };

    return this.http
      .patch(apiurl, content, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rjs = response as any;
          const pto2 = new Photo();
          pto2.parseData(rjs);

          return pto2;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createPhotoTag(photoId: string, tags: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}PhotoTags`;

    // Replace
    const content = {
      PhotoID: photoId,
      TagString: tags,
    };

    return this.http
      .post(apiurl, content, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public deletePhotoTag(photoId: string, tags: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}PhotoTags(PhotoID='${photoId},TagString='${tags}')`;

    return this.http
      .delete(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // Delete photo
  public deletePhoto(photoId: string): Observable<boolean> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}Photos('${photoId}')`;

    return this.http
      .delete(apiurl, {
        headers,
        params,
      })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public assignPhotoToAlbum(albid: number, photoid: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}AlbumPhotos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    const link = new AlbumPhotoLink();
    link.albumID = albid;
    link.photoID = photoid;
    const odata = link.writeJSONString();

    return this.http
      .post(apiurl, odata, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          const link2 = new AlbumPhotoLink();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link2.parseData(response as any);
          return link2;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText + '; ' + error.error.toString() + '; ' + error.message));
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getStatistics(): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json').append('Accept', 'application/json');
    const params: HttpParams = new HttpParams();
    const apiurl = `${this.apiUrl}api/Statistics`;

    return this.http
      .get(apiurl, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error(error.statusText + '; ' + error.error.error.toString() + '; ' + error.message)
          );
        })
      );
  }
}
