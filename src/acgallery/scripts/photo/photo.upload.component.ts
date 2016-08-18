import { Component, OnInit }                from '@angular/core';
import { Photo }                            from './photo';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { PhotoService }                     from './photo.service';
import { Observable }                       from 'rxjs/Observable';
import { Http, Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';

@Component({
    selector: 'my-photo-upload',
    templateUrl: 'app/views/photo/photo.upload.html'
})

export class PhotoUploadComponent implements OnInit {

    public selectedFiles: any;
    public progressNum: number;

    constructor(
        private router: Router,
        private photoservice: PhotoService) {

        this.photoservice.progress$.subscribe(
            data => {
                console.log('progress = ' + data);
                this.progressNum = data;
            });
    }

    ngOnInit() {
    }

    onChange(event) {
        console.log('onChange');
        this.selectedFiles = event.srcElement.files;
    }

    onSubmit(event) {
        this.photoservice.makeFileRequest([], this.selectedFiles).subscribe(value => {
            console.log(value);

            // Todo
            if (value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    let nfile = value[i];
                    // Update the database                   

                }
            }
        });        
    }
}

