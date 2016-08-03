import { Component, OnInit }                from '@angular/core';
import { Photo }                            from './photo';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE }   from '@ng-bootstrap/ng-bootstrap';
import { PhotoService }                     from './photo.service';

@Component({
    selector: 'my-photo-upload',
    templateUrl: 'app/views/photo/photo.upload.html',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    precompile: [NGB_PRECOMPILE],
    providers: [ PhotoService ]
})

export class PhotoUploadComponent implements OnInit {

    public selectedFiles: any;
    public service: PhotoService;

    constructor(
        private router: Router,
        private psservice: PhotoService) {
        this.service = psservice;

        this.service.progress$.subscribe(
            data => {
                console.log('progress = ' + data);
            });
    }

    ngOnInit() {
    }

    onChange(event) {
        console.log('onChange');
        this.selectedFiles = event.srcElement.files;
    }

    onSubmit(event) {
        this.service.makeFileRequest('api/file', [], this.selectedFiles).subscribe(value => {
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

