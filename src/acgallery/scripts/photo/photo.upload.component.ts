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
})

export class PhotoUploadComponent implements OnInit {


    public selectedFiles: any;
    public service: any;

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
        var files = event.srcElement.files;
        console.log(files);

        this.selectedFiles = files;
    }

    onSubmit(event) {
        this.service.makeFileRequest('http://localhost:8182/upload', [], this.selectedFiles).subscribe(() => {
            console.log('sent');
        });        
    }
}

