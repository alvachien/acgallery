import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, Response, RequestOptions, URLSearchParams }   from '@angular/http';
import '../rxjs-operators';
import { Album, SelectableAlbum, AlbumPhotoByAlbum,
    AlbumPhotoByPhoto }  from './album';
import { Photo } from '../photo/photo';
import { AlbumAPIUrl, AlbumPhotoByAlbumAPIUrl,
    AlbumPhotoByPhotoAPIUrl } from '../app.setting';
import { AuthService } from '../auth.service';

@Injectable()
export class AlbumService {
    private albumUrl: string = AlbumAPIUrl;  // URL to web API
    private albumArray$: Subject<Album[]>;
    private dataStore: {
        albums: Album[],
        isAlbumLoaded: boolean
    };

    constructor(private http: Http,
        private authService: AuthService) {
    }

    getAlbums(): Observable<Album[]> {
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        return this.http.get(this.albumUrl, { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbumsContainsPhoto(pid: string): Observable<Album[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('photoid', pid);
        return this.http.get(this.albumUrl, { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAlbum(id: number | string): Observable<Album> {
        //let params: URLSearchParams = new URLSearchParams();
        //params.set('id', id.toString());

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
        return this.http.get(this.albumUrl + "/" + id.toString()
            //,{
            //    search: params
            //}
            , { headers: headers }
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
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(album);

        return this.http.post(this.albumUrl, data, { headers: headers })
            .map(response => response.json());
    }

    public updateAlbumPhotoByAlbum(apba: AlbumPhotoByAlbum) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(apba);

        return this.http.post(AlbumPhotoByAlbumAPIUrl, data, { headers: headers })
            .map(response => response.json());
    }

    public updateAlbumPhotoByPhoto(apbp: AlbumPhotoByPhoto) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(apbp);

        return this.http.post(AlbumPhotoByPhotoAPIUrl, data, { headers: headers })
            .map(response => response.json());
    }

    public updateMetadata(album: Album) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(album);

        return this.http.put(this.albumUrl, data, { headers: headers })
            .map(response => response.json());
    }

    private extractSingleData(res: Response) {
        let body = res.json();
        if (body) {
            let alm2 = new Album();
            alm2.init(body.id, body.title, body.desp, body.firstPhotoThumnailUrl, body.createdAt, body.createdBy,
                body.isPublic, body.accessCode, body.photoCount);
            alm2.Photoes = [];
            for (var i = 0; i < body.photoList.length; i++) {
                let pto = new Photo();
                pto.photoId = body.photoList[i].photoId;
                pto.fileUrl = body.photoList[i].fileUrl;
                pto.thumbnailFileUrl = body.photoList[i].thumbnailFileUrl;
                pto.title = body.photoList[i].title;
                pto.desp = body.photoList[i].desp;

                pto.exifTags = body.photoList[i].exifTags;

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
                alm2.init(alm.id, alm.title, alm.desp, alm.firstPhotoThumnailUrl, alm.createdAt, alm.createdBy,
                    alm.isPublic, alm.accessCode, alm.photoCount);

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
