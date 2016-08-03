import { Http, Response }   from '@angular/http';
import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs/Observable';

@Injectable()
export class APIService {
    private _apiUri: string;

    constructor(public http: Http) {

    }

    createAlbum(data?: any, mapJson: boolean = true) {
        //if (mapJson)
        //    return this.http.post(this._apiUri, data)
        //        .map(response => <any>(<Response>response).json());
        //else
        return this.http.post(this._apiUri, data);
    }

    createPhoto(data?: any) {
        // Create a photo, 
    }
}
