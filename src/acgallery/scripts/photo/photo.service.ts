import { Injectable }   from '@angular/core';
import { Observable }   from 'rxjs/Rx';
import { Photo }        from './photo';
import { MockedPhoto }  from './photo.mockdata';

@Injectable()
export class PhotoService {
    public progress$: any;
    public progressObserver: any;
    public progress: number;

    constructor() {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    public makeFileRequest(url: string, params: string[], files: File[]): Observable<Array<any>> {
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
            };

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }

    public getMockdata() {
        return Promise.resolve(MockedPhoto);
    }
}
