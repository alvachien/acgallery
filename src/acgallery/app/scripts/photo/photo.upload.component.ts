import { Component, OnInit, NgZone }        from '@angular/core';
import { Photo }                            from './photo';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { PhotoService }                     from './photo.service';
import { Observable }                       from 'rxjs/Observable';
import { Http, Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';
import { DialogService }                    from '../dialog.service';

@Component({
    selector: 'my-photo-upload',
    templateUrl: 'app/views/photo/photo.upload.html'
})

export class PhotoUploadComponent implements OnInit {

    public selectedFiles: any;
    public progressNum: number = 0;
    public isUploading: boolean = false;

    constructor(
        private zone: NgZone,
        private router: Router,
        private photoservice: PhotoService,
        private dlgservice: DialogService) {

        this.photoservice.progress$.subscribe(
            data => {
                //console.log('progress = ' + data);
                //this.progressNum = data;
                this.zone.run(() => {
                    this.progressNum = +data;
                });
            });
    }

    ngOnInit() {
    }

    onChange(event) {
        console.log('onChange');
        this.selectedFiles = event.srcElement.files;

        // Check the file size
        let checksuccess: boolean = true;
        for (let i = 0; i < this.selectedFiles.length; i++) {
            if (this.selectedFiles[i].size >= 3145728 || this.selectedFiles[i].size <= 409600) {
                checksuccess = false;
                this.dlgservice.confirm("File " + this.selectedFiles[i].name + " with size (" + this.selectedFiles[i].size / 1024 + " KB) which is larger than 3MB or less than 400KB! ");
                break;
            }
        }

        if (!checksuccess) {
            this.selectedFiles = null;
        }
    }

    onSubmit(event) {
        this.isUploading = true;

        this.photoservice.makeFileRequest([], this.selectedFiles).subscribe(value => {
            //console.log(value);

            // Just navigate to Photos page
            this.isUploading = false;
            this.router.navigate(['/photo']);

            //// Todo
            //if (value.length > 0) {
            //    for (let i = 0; i < value.length; i++) {
            //        let nfile = value[i];
            //        // Update the database                   

            //    }
            //}
        });        
    }
}

