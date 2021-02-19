import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SequenceList } from 'actslib';

import { environment } from 'src/environments/environment';
import { Album, Photo } from '../models';

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

  // Albums
  public getAlbums(): Observable<{
    totalCount: number,
    items: SequenceList<Album>}> {

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
    params = params.append('$top', '30');
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
}
