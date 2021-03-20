import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SequenceList } from 'actslib';

import { environment } from 'src/environments/environment';
import { Album, AlbumPhotoLink, Photo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OdataService {
  apiUrl = `${environment.apiRootUrl}`;

  private isMetadataLoaded = false;
  private metadataInfo = '';

  // Mockdata
  // // Mockdata - knowledge item
  // private mockedKnowledgeItem: KnowledgeItem[] = [];
  // // Mockdata - exercise item
  // private mockedExerciseItem: ExerciseItem[] = [];

  constructor(private http: HttpClient,
    ) { }

  public getMetadata(forceReload?: boolean): Observable<any> {
    if (!this.isMetadataLoaded || forceReload) {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/xml,application/json')
                .append('Accept', 'text/html,application/xhtml+xml,application/xml');

      let metadataurl = `${this.apiUrl}$metadata`;
      if (environment.mockdata) {
        metadataurl = `${environment.basehref}assets/mockdata/metadata.xml`;
      }
      return this.http.get(metadataurl, {
          headers,
          responseType: 'text'
        })
        .pipe(map(response => {
          this.isMetadataLoaded = true;
          this.metadataInfo = response as unknown as string;
          return this.metadataInfo;
        }),
        catchError((error: HttpErrorResponse) => throwError(error.statusText + '; ' + error.error + '; ' + error.message)
        ));
    } else {
      return of(this.metadataInfo);
    }
  }

  ///
  /// Albums
  ///
  public getAlbums(skip = 0, top = 20): Observable<{totalCount: number, items: SequenceList<Album>}> {
    // TBD.
    // if (environment.mockdata && this.mockedKnowledgeItem.length > 0) {
    //   return of({
    //     totalCount: this.mockedKnowledgeItem.length,
    //     items: this.mockedKnowledgeItem
    //   });
    // }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    params = params.append('$top', top.toString());
    params = params.append('$skip', skip.toString());
    params = params.append('$count', 'true');
    // TBD.
    // params = params.append('$select', 'ID,Category,Title,CreatedAt,ModifiedAt');
    let apiurl = `${this.apiUrl}Albums`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http.get(apiurl, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        const ritems = rjs.value as any[];
        const items: SequenceList<Album> = new SequenceList<Album>();
        
        for(let item of ritems) {
          const rit: Album = new Album();
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
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  public createAlbum(alb: Album): Observable<Album> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let apiurl = `${this.apiUrl}Albums`;
    let jdata = alb.writeJSONString();
    return this.http.post(apiurl, jdata, {
        headers,
      })
    .pipe(map(response => {
      const rjs = response as any;
      let alb2 = new Album();
      alb2.parseData(rjs);
      return alb2;
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
    }));
  }

  public readAlbum(albumid: number): Observable<Album> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}Albums(${albumid})`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http.get(apiurl, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        const rit: Album = new Album();
        rit.parseData(rjs);
        return rit;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  public getAlbumRelatedPhotos(albumid: number): Observable<{totalCount: number, items: SequenceList<Photo>}> {
    // https://localhost:25325/Albums/GetPhotos(2005)?$count=true&$top=3    
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    params = params.append('$top', '30');
    params = params.append('$count', 'true');
    let apiurl = `${this.apiUrl}Albums/GetPhotos(${albumid})`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http.get(apiurl, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        const ritems = rjs.value as any[];
        const items: SequenceList<Photo> = new SequenceList<Photo>();
        
        for(let item of ritems) {
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
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  // Photos
  public getPhotos(skip = 0, top = 20): Observable<{ totalCount: number, items: SequenceList<Photo>}> {
    // TBD.
    // if (environment.mockdata && this.mockedKnowledgeItem.length > 0) {
    //   return of({
    //     totalCount: this.mockedKnowledgeItem.length,
    //     items: this.mockedKnowledgeItem
    //   });
    // }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    params = params.append('$top', top.toString());
    params = params.append('$skip', skip.toString());
    params = params.append('$count', 'true');
    // TBD.
    // params = params.append('$select', 'ID,Category,Title,CreatedAt,ModifiedAt');
    let apiurl = `${this.apiUrl}Photos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    return this.http.get(apiurl, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        const ritems = rjs.value as any[];
        const items: SequenceList<Photo> = new SequenceList<Photo>();
        
        for(let item of ritems) {
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
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  public createPhoto(pto: Photo): Observable<Photo> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}Photos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    let odata = pto.generateJson();
    return this.http.post(apiurl, odata, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        let pto2 = new Photo();
        pto2.parseData(rjs);
        
        return pto2;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  // Change photo
  public changePhoto(pto: Photo): Observable<Photo> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}Photos('${pto.photoId}')`;

    let odata = pto.generateJson();
    return this.http.put(apiurl, odata, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        let pto2 = new Photo();
        pto2.parseData(rjs);
        
        return pto2;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  // Change photo via patch
  public changePhotoInfo(photoId: string, title: string, desp: string, ispublic: boolean) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}Photos('${photoId}')`;

    // Replace
    let content = {
      'Title': title,
      'Desp': desp,
      'IsPublic': ispublic
    };

    return this.http.patch(apiurl, content, {
        headers,
        params,
      })
      .pipe(map(response => {
        const rjs = response as any;
        let pto2 = new Photo();
        pto2.parseData(rjs);
        
        return pto2;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));    
  }

  // Delete photo
  public deletePhoto(photoId: string): Observable<boolean> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}Photos('${photoId}')`;

    return this.http.delete(apiurl, {
        headers,
        params,
      })
      .pipe(map(response => {
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }

  public assignPhotoToAlbum(albid: number, photoid: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json');

    let params: HttpParams = new HttpParams();
    let apiurl = `${this.apiUrl}AlbumPhotos`;
    // TBD.
    // if (environment.mockdata) {
    //   apiurl = `${environment.basehref}assets/mockdata/albums.json`;
    //   params = new HttpParams();
    // }

    let link = new AlbumPhotoLink();
    link.albumID = albid;
    link.photoID = photoid;
    let odata = link.writeJSONString();

    return this.http.post(apiurl, odata, {
        headers,
        params,
      })
      .pipe(map(response => {
        let link2 = new AlbumPhotoLink();
        link2.parseData(response as any);
        return link2;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.statusText + '; ' + error.error + '; ' + error.message);
      }));
  }
}
