import { Injectable }       from '@angular/core';
import { Subject }          from 'rxjs/Subject';
import { Observable }       from 'rxjs/Observable';
import { Album, AlbumPhotoLink } from '../model/album';
import { Photo }            from '../model/photo';
import { Http, Headers, Response, RequestOptions, URLSearchParams }
                            from '@angular/http';
import '../rxjs-operators';
import { AuthService }      from './auth.service';
import { PhotoAPIUrl }      from '../app.setting';
import { BufferService }    from './buffer.service';
import { DialogService }    from './dialog.service';

@Injectable()
export class PhotoService {
    private photoUploadUrl: string;
    private photoAPIUrl: string;
    private _photos$: Subject<Photo[]>;
    private _uploadprog$: Subject<number>;
    private _upload$: Subject<any>;
    private _photosByAlbum$: Subject<Photo[]>;
    private progress: number;

    constructor(private http: Http,
        private authService: AuthService,
        private buffService: BufferService,
        private dialogService: DialogService) {
        this.photoUploadUrl = 'api/file';  // URL to upload photo
        this.photoAPIUrl = PhotoAPIUrl; // URL to recod th photo

        this._photos$ = <Subject<Photo[]>>new Subject();
        this._uploadprog$ = <Subject<number>>new Subject();
        this._upload$ = <Subject<any>>new Subject();
        this._photosByAlbum$ = <Subject<Photo[]>>new Subject();
    }

    get photos$() {
        return this._photos$.asObservable();
    }
    get uploadprog$() {
        return this._uploadprog$.asObservable();
    }
    get upload$() {
        return this._upload$.asObservable();
    }
    get photosByAlbum$() {
        return this._photosByAlbum$.asObservable();
    }

    loadPhotos(forceReload?: boolean) {

        if (!forceReload && this.buffService.isPhotoLoaded) {
            this._photos$.next(this.buffService.photos);
            return;
        }

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        this.http.get(this.photoAPIUrl, { headers: headers })
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(data => {
                this.buffService.setPhotos(data);
                this._photos$.next(this.buffService.photos);
            },
            error => {
                // It should be handled already
            });
    }

    loadPhoto(id: string | number, forceReload?: boolean) {
        console.log("Todo!!");
        //if (!forceReload && this.buffService.isPhotoLoaded) {
        //    this._photos$.next(this.buffService.photos);
        //    return;
        //}

        //var headers = new Headers();
        //headers.append('Accept', 'application/json');
        //if (this.authService.authSubject.getValue().isAuthorized)
        //    headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        //this.http.get(this.photoAPIUrl, { headers: headers })
        //    .map(this.extractData)
        //    .catch(this.handleError)
        //    .subscribe(data => {
        //        this.buffService.photos = data;
        //        this.buffService.isPhotoLoaded = true;
        //        this._photos$.next(this.buffService.photos);
        //    },
        //    error => {
        //        // It should be handled already
        //    });
    }

    loadAlbumPhoto(albumid: string | number, accesscode?: string, forceReload?: boolean) {
        if (!forceReload && this.buffService.isPhotoLoaded) {
            this._photos$.next(this.buffService.photos);
            return;
        }

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
        let params: URLSearchParams = new URLSearchParams();
        params.set('albumid', albumid.toString());
        if (accesscode) {
            params.set('accesscode', accesscode);
        }            

        this.http.get(this.photoAPIUrl, { search: params, headers: headers })
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(data => {
                let arlinks: Array<AlbumPhotoLink> = new Array<AlbumPhotoLink>();
                data.forEach((value, index, array) => {
                    let idx: number = -1;
                    this.buffService.photos.every((value2, index2, array2) => {
                        if (value2.photoId === value.photoId) {
                            idx = index2;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if (idx !== -1) {
                        this.buffService.photos[idx] = value;
                    } else {
                        this.buffService.photos.push(value);
                    }

                    let link: AlbumPhotoLink = new AlbumPhotoLink();
                    link.AlbumID = +albumid;
                    link.PhotoID = value.photoId;
                    arlinks.push(link);
                });

                this.buffService.setLinkInfo(arlinks, +albumid, null);

                this._photos$.next(this.buffService.photos);
                this._photosByAlbum$.next(data);
            },
            error => {
                // It should be handled already
            });
    }

    public updateFileMetadata(photo: Photo) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(photo);

        return this.http.put(this.photoUploadUrl, data, { headers: headers })
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
                    let respObj = JSON.parse(xhr.response);
                    this._upload$.next(respObj);
                    this._upload$.complete();
                } else {
                    this._upload$.error(xhr.response);
                }
            }
        };

        xhr.upload.onprogress = (event) => {
            this.progress = Math.round(event.loaded / event.total * 100);

            this._uploadprog$.next(this.progress);
            if (this.progress == 100)
                this._uploadprog$.complete();
        };

        xhr.open('POST', this.photoUploadUrl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        xhr.send(formData);
    }

    getFiles(): Observable<Photo[]> {
        return this.http.get(this.photoUploadUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        if (error.status === 401) {
            // Todo. 
            // The dialog cannot show!
            //this.dialogService.confirm("Unauthorized operation, it may due to the Access Code is not correct!");
        }            
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
