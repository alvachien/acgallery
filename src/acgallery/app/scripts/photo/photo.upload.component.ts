import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef }        from '@angular/core';
import { Photo, UpdPhoto }                  from '../model/photo';
import { Router }                           from '@angular/router';
import { PhotoService }                     from '../services/photo.service';
import { Observable }                       from 'rxjs/Observable';
import { Http, Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';
import { Album }                            from '../model/album';
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
    public arUpdPhotos: UpdPhoto[] = [];
    private subUpdProgress: Subscription;
    private subUpload: Subscription;
    private uploader: any = null;
    public assignAlbum: number = 0;
    private canCrtAlbum: boolean = false;
    public albumcreate: Album = null;
    @ViewChild('uploadFileRef') elemUploadFile;

    constructor(
        private zone: NgZone,
        private router: Router,
        private photoservice: PhotoService,
        private dlgservice: DialogService,
        private authservice: AuthService,
        private renderer: Renderer,
        private elm: ElementRef) {
        console.log("Entering constructor of PhotoUploadComponent");
        //console.log("elm:", this.elm);

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
        this.canCrtAlbum = this.authservice.authSubject.getValue().canCreateAlbum();
        this.albumcreate = new Album();
    }

    ngOnInit() {
        console.log("Entering ngOnInit of PhotoUploadComponent");
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
        console.log("Entering ngAfterInit of PhotoUploadComponent");
        let that = this;

        if (!this.uploader) {
            this.uploader = new qq.FineUploaderBasic({
                button: that.elemUploadFile.nativeElement,
                autoUpload: false,
                request: {
                    endpoint: 'api/file'
                },
                validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                    minSizeLimit: that.photoMinKBSize * 1024,
                    sizeLimit: that.photoMaxKBSize * 1024
                },
                callbacks: {
                    onComplete: function (id, name, responseJSON) {
                        console.log("OnComplete: " + id.toString() + ", " + name);
                    },
                    onAllComplete: function (succids, failids) {
                        console.log("OnAllComplete: " + succids.toString() + ", " + failids.toString());
                    },
                    onStatusChange: function (id: number, oldstatus, newstatus) {
                        console.log("Entering OnStatusChanged of PhotoUploadComponent upon ID: " + id.toString() + "; From " + oldstatus + " to " + newstatus);
                        if (newstatus === "rejected") {
                            let errormsg = "File size must smaller than " + that.photoMaxKBSize + " and larger than " + that.photoMinKBSize;
                            that.dlgservice.confirm(errormsg);
                        }
                        //SUBMITTED
                        //QUEUED
                        //UPLOADING
                        //UPLOAD_RETRYING
                        //UPLOAD_FAILED
                        //UPLOAD_SUCCESSFUL
                        //CANCELED
                        //REJECTED
                        //DELETED
                        //DELETING
                        //DELETE_FAILED
                        //PAUSED
                    },
                    onSubmit: function (id: number, name: string) {
                        console.log("Entering onSubmit of PhotoUploadComponent: " + id.toString() + " " + name);
                    },
                    onSubmitted: function (id: number, name: string) {
                        console.log("Entering onSubmitted of PhotoUploadComponent: " + id.toString() + " " + name);
                        if (that.uploader) {
                            var fObj = that.uploader.getFile(id);
                            that.uploader.setName(that.uploader.getUuid(id));
                            that.readImage(id, fObj, name, that.arUpdPhotos);
                        } else {
                            let errormsg = "Failed to process File " + name;
                            that.dlgservice.confirm(errormsg);
                        }
                    },
                    onTotalProgress: function (totalUploadedBytes: number, totalBytes: number) {
                        console.log("Entering OnTotalProgress of PhotoUploadComponent: " + totalUploadedBytes.toString() + " of " + totalBytes.toString());
                        if (totalBytes > 0 && totalUploadedBytes > 0) {
                            that.onUploadProgress(100 * totalUploadedBytes / totalBytes);
                        }                        
                    },
                    onUpload: function (id: number, name: string) {
                        console.log("Entering OnUpload of PhotoUploadComponent: " + id.toString() + ", " + name);
                    },
                    onValidate: function (data) {
                        console.log("Entering OnValidate of PhotoUploadComponent: ");
                        console.log(data);
                        return true;
                    }
                }
            });
        }
    }

    ngOnDestroy() {
        console.log("Entering ngOnDestroy of PhotoUploadComponent");
        if (this.subUpdProgress) {
            this.subUpdProgress.unsubscribe();
            this.subUpdProgress = null;
        }
        if (this.subUpload) {
            this.subUpload.unsubscribe();
            this.subUpload = null;
        }
    }

    onAssignAblumClick(num: number | string) {
        this.zone.run(() => {
            this.assignAlbum = +num;
        });
    }

    isAssginToExistingAlbum(): boolean {
        return 1 === +this.assignAlbum;
    }

    isAssginToNewAlbum(): boolean {
        return 2 === +this.assignAlbum;
    }

    canUploadPhoto(): boolean {
        return this.photoMaxKBSize > 0;
    }

    canCreateAlbum(): boolean {
        return this.canCrtAlbum;
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
                    this.readImage(i, file, this.arUpdPhotos);
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

    private readImage(fid: number, file, nname, arPhotos: UpdPhoto[]) {
        var reader = new FileReader();
        let that = this;

        reader.addEventListener("load", function () {
            var image = new Image();

            image.addEventListener("load", function () {
                let updPhoto: UpdPhoto = new UpdPhoto();
                updPhoto.ID = +fid;
                updPhoto.OrgName = file.name;
                updPhoto.Name = nname;
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
        // Ensure the uploading criteria
        if (!this.arUpdPhotos || this.arUpdPhotos.length <= 0) {
            return;
        }

        this.isUploading = true;
        this.uploader.uploadStoredFiles();

        this.photoservice.uploadFile([], this.selectedFiles);
    }

    onUploading(data: any) {
        this.isUploading = false;
        this.router.navigate(['/photo']);
    }
}

