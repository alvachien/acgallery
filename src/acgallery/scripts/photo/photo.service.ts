import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';
import { Photo }            from './photo';
import { MockedPhoto }      from './photo.mockdata';
import { Http, Headers,Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';

@Injectable()
export class PhotoService {
    public progress: number;
    public progressObserver: any;
    public progress$ : any;
    private fileUrl: string = 'http://achihapi.azurewebsites.net/api/file';  // URL to web API

    constructor(private http: Http) {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        });
    }

    public makeFileRequest(params: string[], files: File[]): Observable<Array<any>> {
        ////let body = JSON.stringify({ name });
        //let headers = new Headers({ 'Content-Type': undefined });
        //let options = new RequestOptions({ headers: headers });

        //let formData: FormData = new FormData();

        //for (let i = 0; i < files.length; i++) {
        //    formData.append("uploads[]", files[i], files[i].name);
        //}

        //this.http.post(this.fileUrl, formData, options).subscribe(
        //    x => {
        //    }
        //);

        //$http.post(uploadUrl, fd, {
        //    transformRequest: angular.identity,
        //    headers: { 'Content-Type': undefined }
        //})
        //return this.http.post(this.fileUrl, body, options)
        //    .map(this.extractData)
        //    .catch(this.handleError);

        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let respObj = JSON.parse(xhr.response);
                        observer.next(respObj);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                this.progressObserver.next(this.progress);
                if (this.progress == 100)
                    this.progressObserver.complete();
            };

            xhr.open('POST', this.fileUrl, true);
            xhr.send(formData);
        });
    }

    getFiles(): Observable<Photo[]> {
        return this.http.get(this.fileUrl)
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
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    public getMockdata() {
        return Promise.resolve(MockedPhoto);
    }
}
