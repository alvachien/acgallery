import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions, URLSearchParams }   from '@angular/http';
import '../rxjs-operators';
import { Album } from './album';
import { Photo } from '../photo/photo';
import { AlbumAPIUrl } from '../app.setting';

@Injectable()
export class AlbumService {
    constructor(private http: Http) {
    }

    private albumUrl: string = AlbumAPIUrl;  // URL to web API

    getAlbums(): Observable<Album[]> {
        return this.http.get(this.albumUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbum(id: number | string): Observable<Album> {
        //let params: URLSearchParams = new URLSearchParams();
        //params.set('id', id.toString());

        return this.http.get(this.albumUrl + "/" + id.toString()
            //,{
            //    search: params
            //}
            )
            .map(this.extractSingleData)
            .catch(this.handleError);
            //.subscribe(
            //(response) => this.onGetForecastResult(response.json()),
            //(error) => this.onGetForecastError(error.json()),
            //() => this.onGetForecastComplete()
            //);        
    }

    createAlbum(album: Album) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var data = JSON && JSON.stringify(album);

        return this.http.post(this.albumUrl, data, { headers: headers })
            .map(response => response.json());
    }

    private extractSingleData(res: Response) {
        let body = res.json();
        if (body) {
            let alm2 = new Album();
            alm2.init(body.id, body.title, body.desp, body.firstPhotoThumnailUrl, body.createdAt, body.createdBy, body.photoCount);
            alm2.Photoes = [];
            for (var i = 0; i < body.photoList.length; i++) {
                let pto = new Photo();
                pto.id = body.photoList[i].photoId;
                pto.fileUrl = body.photoList[i].fileUrl;
                pto.thumbnailFileUrl = body.photoList[i].thumbnailFileUrl;
                pto.title = body.photoList[i].title;
                pto.desp = body.photoList[i].desp;
                alm2.Photoes.push(pto);
            }

            return alm2;
        }

        return body || {};
    }

    private extractData(res: Response) {
        let body = res.json();
        if (body && body instanceof Array) {
            let almes = new Array<Album>();
            for (let alm of body) {
                let alm2 = new Album();
                alm2.init(alm.id, alm.title, alm.desp, alm.firstPhotoThumnailUrl, alm.createdAt, alm.createdBy, alm.photoCount);

                almes.push(alm2);
            }
            return almes;
        }

        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
