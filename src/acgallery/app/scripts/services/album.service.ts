import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Observable';
import { Subject }      from 'rxjs/Subject';
import {
    Http, Headers, Response,
    RequestOptions, URLSearchParams }  from '@angular/http';
import '../rxjs-operators';
import {
    Album, SelectableAlbum, AlbumPhotoByAlbum, AlbumPhotoLink,
    AlbumPhotoByPhoto } from '../model/album';
import { Photo }        from '../model/photo';
import {
    AlbumAPIUrl, AlbumPhotoByAlbumAPIUrl, PhotoAPIUrl,
    AlbumPhotoByPhotoAPIUrl, DebugLogging } from '../app.setting';
import { AuthService } from '../services/auth.service';
import { BufferService } from '../services/buffer.service';

@Injectable()
export class AlbumService {
    private albumUrl: string;
    private _albums$: Subject<Album[]>;
    private _albumsByPhoto$: Subject<Album[]>;
    private _curalbum$: Subject<Album>;

    constructor(private http: Http,
        private authService: AuthService,
        private buffService: BufferService) {
        this.albumUrl = AlbumAPIUrl;
        this._albums$ = <Subject<Album[]>>new Subject();
        this._albumsByPhoto$ = <Subject<Album[]>>new Subject();
        this._curalbum$ = <Subject<Album>>new Subject();
    }

    get albums$() {
        return this._albums$.asObservable();
    }
    get albumsByPhoto$() {
        return this._albumsByPhoto$.asObservable();
    }
    get curalbum$() {
        return this._curalbum$.asObservable();
    }

    loadAlbums(forceReload?: boolean) {        
        if (!forceReload && this.buffService.isAlbumLoaded) {
            this._albums$.next(this.buffService.albums);
            return;
        }

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        this.http.get(this.albumUrl + "?top=100", { headers: headers })
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(data => {
                console.log(data);

                this.buffService.setAlbums(data);
                this._albums$.next(this.buffService.albums);
            },
            error => {
                // It should be handled already
            });
    }
    loadAlbumsex(paramString: string) {
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        return this.http.get(this.albumUrl + paramString, { headers: headers })
            .map(response => response.json());
    }

    loadAlbum(id: number | string, forceReload?: boolean) {
        if (!forceReload) {
            if (this.buffService.isAlbumLoaded && this.buffService.albums.length > 0) {
                //this.dataStore.albums.forEach((value, index, array) => {
                //    if (value.Id === +id) {
                //        return;
                //    }
                //});

                // We cannot use the logic below because we need update the curAlbum subject
                //if (this.buffService.albums.some((value, index, array) => {
                //    return value.Id === +id;
                //})) {
                //    this._albums$.next(this.buffService.albums);
                //    return;
                //}
                let idx: number = -1;
                this.buffService.albums.every((value, index, array) => {
                    if (value.Id === +id) {
                        idx = index;
                        return false;;
                    } else {
                        return true;
                    }
                });

                if (idx != -1) {
                    this._albums$.next(this.buffService.albums);
                    this._curalbum$.next(this.buffService.albums[idx]);
                    return;
                }
            }
        }

        var headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        //Observable.forkJoin(this.http.get(this.albumUrl + "/" + id.toString(), { headers: headers }),
        //    this.http.get(PhotoAPIUrl));

        this.http.get(this.albumUrl + "/" + id.toString(), { headers: headers })
            .map(this.extractSingleData)
            .catch(this.handleError)
            .subscribe(data => {
                let idx: number = -1;
                this.buffService.albums.every((value, index, array) => {
                    if (value.Id === +id) {
                        idx = index;
                        return false;;
                    } else {
                        return true;
                    }
                });

                if (idx != -1) {
                    this.buffService.albums[idx] = data;
                } else {
                    this.buffService.albums.push(data);
                }
                this._albums$.next(this.buffService.albums);
                this._curalbum$.next(data);
            }, error => {
                // Shall be handled already
            });
    }

    loadAlbumContainsPhoto(photoid: string, forceReload?: boolean) {
        if (!forceReload && this.buffService.isPhotoLinkLoaded(photoid)) {
            if (this.buffService.albums.length > 0) {
                let links: AlbumPhotoLink[] = this.buffService.getLinkInfo(null, photoid);
                let uniqAlbums = new Map<number, Album>();
                let data: Album[] = [];

                links.forEach((val, idx) => {
                    if (!uniqAlbums.has(val.AlbumID)) {
                        let album: Album;
                        this.buffService.albums.every((val2, idx2) => {
                            if (val2.Id === val.AlbumID) {
                                album = val2;
                                return false;
                            }
                            return true;
                        });
                        uniqAlbums.set(val.AlbumID, album);
                        data.push(album);
                    }
                });
                this._albumsByPhoto$.next(data);
                return;
            }
        }

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        if (this.authService.authSubject.getValue().isAuthorized)
            headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());
        let params: URLSearchParams = new URLSearchParams();
        params.set('photoid', photoid);

        this.http.get(this.albumUrl, { search: params, headers: headers })
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe((data: Album[]) => {
                let arlinks: Array<AlbumPhotoLink> = new Array<AlbumPhotoLink>();
                data.forEach((value, index, array) => {
                    let idx: number = -1;
                    this.buffService.albums.every((value2, index2, array2) => {
                        if (value2.Id === value.Id) {
                            idx = index2;
                            return false;
                        } else {
                            return true;
                        }                        
                    });

                    if (idx !== -1) {
                        this.buffService.albums[idx] = value;
                    } else {
                        this.buffService.albums.push(value);
                    }

                    let link: AlbumPhotoLink = new AlbumPhotoLink();
                    link.AlbumID = value.Id;
                    link.PhotoID = photoid;
                    arlinks.push(link);
                });

                this.buffService.setLinkInfo(arlinks, null, photoid);

                this._albums$.next(this.buffService.albums);
                this._albumsByPhoto$.next(data);
            }, error => {
                // It should be handled already
            });
    }

    createAlbum(album: Album) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(album);

        this.http.post(this.albumUrl, data, { headers: headers })
            .map(response => response.json())
            .subscribe(data => {
                // The data shall return the new album with new created ID
                this._curalbum$.next(data);
            }, error => {
                // Error occurred
                console.log("Error occurred in album.service.createAlbum()!!!");
            });
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

        this.http.post(AlbumPhotoByPhotoAPIUrl, data, { headers: headers })
            .map(response => response.json());
    }

    public updateMetadata(album: Album) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.authService.authSubject.getValue().getAccessToken());

        var data = JSON && JSON.stringify(album);

        this.http.put(this.albumUrl, data, { headers: headers })
            .map(response => response.json());
    }

    private extractSingleData(res: Response) {
        let body = res.json();
        if (body) {
            let alm2 = new Album();
            alm2.init(body.id, body.title, body.desp, body.firstPhotoThumnailUrl, body.createdAt, body.createdBy,
                body.isPublic, body.accessCode, body.photoCount);
            //alm2.Photoes = [];
            //for (var i = 0; i < body.photoList.length; i++) {
            //    let pto = new Photo();
            //    pto.photoId = body.photoList[i].photoId;
            //    pto.fileUrl = body.photoList[i].fileUrl;
            //    pto.thumbnailFileUrl = body.photoList[i].thumbnailFileUrl;
            //    pto.title = body.photoList[i].title;
            //    pto.desp = body.photoList[i].desp;
            //    pto.width = body.photoList[i].width;
            //    pto.height = body.photoList[i].height;

            //    pto.exifTags = body.photoList[i].exifTags;

            //    alm2.Photoes.push(pto);
            //}

            return alm2;
        }

        return body || {};
    }

    private extractData(res: Response) {
        let body = res.json();
        if (body && body.contentList && body.contentList instanceof Array) {
            let almes = new Array<Album>();
            for (let alm of body.contentList) {
                let alm2 = new Album();
                alm2.init(alm.id, alm.title, alm.desp, alm.firstPhotoThumnailUrl, alm.createdAt, alm.createdBy,
                    alm.isPublic, alm.accessCode, alm.photoCount);

                if (!alm2.Thumbnail) {
                    alm2.Thumbnail = '/grey.jpg';
                }

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
