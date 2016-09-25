import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef }        from '@angular/core';
import { Photo, UpdPhoto }                  from '../model/photo';
import { Router }                           from '@angular/router';
import { PhotoService }                     from '../services/photo.service';
import { Observable }                       from 'rxjs/Observable';
import { Http, Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';
import { DialogService }                    from '../services/dialog.service';
import { AuthService }                      from '../services/auth.service';
import { Subscription }                     from 'rxjs/Subscription';
declare var qq: any;

@Component({
    selector: 'my-photo-upload',
    templateUrl: 'app/views/photo/photo.upload.html'
})

export class PhotoUploadComponent implements OnInit, AfterViewInit, OnDestroy {

    public selectedFiles: any;
    public progressNum: number = 0;
    public isUploading: boolean = false;
    public photoMaxKBSize: number = 0;
    public photoMinKBSize: number = 0;
    public arUpdPhotos: UpdPhoto[];
    private subUpdProgress: Subscription;
    private subUpload: Subscription;
    private uploader: any = null;
    @ViewChild('uploadFileRef') elemUploadFile;

    constructor(
        private zone: NgZone,
        private router: Router,
        private photoservice: PhotoService,
        private dlgservice: DialogService,
        private authservice: AuthService,
        private renderer: Renderer,
        private elm: ElementRef) {
        console.log("elm:", this.elm)

        this.authservice.authContent.subscribe((x) => {
            if (x.canUploadPhoto()) {
                let sizes = x.getUserUploadKBSize();
                this.photoMinKBSize = sizes[0];
                this.photoMaxKBSize = sizes[1];
            } else {
                this.photoMinKBSize = 0;
                this.photoMaxKBSize = 0;
            }
            });
    }

    ngOnInit() {
        if (!this.canUploadPhoto()) {
            if (this.authservice.authSubject.getValue().getUserName()) {
                this.router.navigate(['/unauthorized']);
            } else {
                this.router.navigate(['/forbidden']);
            }
        }
        if (!this.subUpdProgress) {
            this.subUpdProgress = this.photoservice.uploadprog$.subscribe(data => this.onUploadProgress(data),
                error => { console.log(error); });
        }
        if (!this.subUpload) {
            this.subUpload = this.photoservice.upload$.subscribe(data => this.onUploading(data),
                error => { console.log(error); });
        }
    }

    ngAfterViewInit() {
        if (!this.uploader) {
            var buttonUpd = document.getElementById("load-file-button-id");
            this.uploader = new qq.FineUploaderBasic({
                button: this.elemUploadFile.nativeElement,
                autoUpload: false,
                request: {
                    endpoint: '/uploads'
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.subUpdProgress) {
            this.subUpdProgress.unsubscribe();
            this.subUpdProgress = null;
        }
        if (this.subUpload) {
            this.subUpload.unsubscribe();
            this.subUpload = null;
        }
    }

    canUploadPhoto(): boolean {
        return this.photoMaxKBSize > 0;
    }

    onChange(event) {

        var files = event.srcElement.files;
        var errors = "";
        if (!files) {
            errors += "File upload not supported by your browser.";
            this.dlgservice.confirm(errors);
            return;
        }

        if (files && files[0]) {
            this.arUpdPhotos = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if ((/\.(png|jpeg|jpg|gif)$/i).test(file.name)) {
                    this.readImage(file, this.arUpdPhotos);
                } else {
                    let updphoto: UpdPhoto = new UpdPhoto();
                    updphoto.Name = file.name;
                    updphoto.IsValid = false;
                    updphoto.ValidInfo = file.name + " Unsupported Image extension\n";
                    this.arUpdPhotos.push(updphoto);
                }
            }
        }

        this.selectedFiles = event.srcElement.files;
    }

    private readImage(file, arPhotos: UpdPhoto[]) {
        var reader = new FileReader();
        let that = this;

        reader.addEventListener("load", function () {
            var image = new Image();

            image.addEventListener("load", function () {
                let updPhoto: UpdPhoto = new UpdPhoto();
                updPhoto.Name = file.name;
                updPhoto.Width = +image.width;
                updPhoto.Height = +image.height;
                let size = Math.round(file.size / 1024);
                updPhoto.Size = size.toString() + 'KB';

                if (size >= that.photoMaxKBSize || size <= that.photoMinKBSize) {
                    updPhoto.ValidInfo = "File " + updPhoto.Name + " with size (" + updPhoto.Size + ") which is larger than " + that.photoMaxKBSize + " or less than " + that.photoMinKBSize;
                    updPhoto.IsValid = false;
                } else {
                    updPhoto.IsValid = true;
                }

                arPhotos.push(updPhoto);
            });

            //var useBlob = false && window.URL;
            //image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;
            //if (useBlob) {
            //    window.URL.revokeObjectURL(file); // Free memory
            //}
            image.src = reader.result;
        });

        reader.readAsDataURL(file);
    }

    onUploadProgress(data: number) {
        this.zone.run(() => {
            this.progressNum = +data;
        });
    }

    onSubmit(event) {
        // Todo, check the file's IsValid!
        //

        this.isUploading = true;

        this.photoservice.uploadFile([], this.selectedFiles);
    }

    onUploading(data: any) {
        this.isUploading = false;
        this.router.navigate(['/photo']);
    }
}

