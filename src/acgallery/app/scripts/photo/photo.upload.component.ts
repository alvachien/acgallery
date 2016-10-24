import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef }        from '@angular/core';
import { Photo, UpdPhoto }                  from '../model/photo';
import { Router }                           from '@angular/router';
import { PhotoService }                     from '../services/photo.service';
import { Observable }                       from 'rxjs/Observable';
import { Http, Response, RequestOptions }   from '@angular/http';
import '../rxjs-operators';
import { Album, AlbumPhotoByAlbum }         from '../model/album';
import { DialogService }                    from '../services/dialog.service';
import { AuthService }                      from '../services/auth.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DebugLogging }                     from '../app.setting';
import { AlbumService }                     from '../services/album.service';
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
    private uploader: any = null;
    public assignAlbum: number = 0;
    private canCrtAlbum: boolean = false;
    public albumcreate: Album = null;
    private photoHadUploaded: Photo[] = [];
    private aruploadflags: any[] = [];

    private subUpdProgress: Subscription = null;
    private subUpload: Subscription = null;
    private subAlbumCreated: Subscription = null;
    @ViewChild('uploadFileRef') elemUploadFile;

    constructor(
        private zone: NgZone,
        private router: Router,
        private photoservice: PhotoService,
        private dlgservice: DialogService,
        private authservice: AuthService,
        private renderer: Renderer,
        private elm: ElementRef,
        private albumservice: AlbumService) {
        if (DebugLogging) {
            console.log("Entering constructor of PhotoUploadComponent");
            console.log(elm);
        }

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
        if (DebugLogging) {
            console.log("Entering ngOnInit of PhotoUploadComponent");
        }
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
        if (!this.subAlbumCreated) {
            this.subAlbumCreated = this.albumservice.curalbum$.subscribe(data => {
                this.afterAlbumCreated(data);
            });
        }
    }

    ngAfterViewInit() {
        if (DebugLogging) {
            console.log("Entering ngAfterInit of PhotoUploadComponent");
        }
        let that = this;

        if (!this.uploader) {
            this.uploader = new qq.FineUploaderBasic({
                button: that.elemUploadFile.nativeElement,
                autoUpload: false,
                request: {
                    endpoint: 'api/file',
                    customHeaders: that.getcustomHeader()
                },
                validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
                    minSizeLimit: that.photoMinKBSize * 1024,
                    sizeLimit: that.photoMaxKBSize * 1024
                },
                callbacks: {
                    onComplete: function (id, name, responseJSON) {
                        if (DebugLogging) {
                            console.log("OnComplete: " + id.toString() + ", " + name);
                            console.log(responseJSON);
                        }

                        if (!responseJSON.success)
                            return;

                        // Then, update the record to Database.
                        let insPhoto = new Photo();
                        insPhoto.photoId = responseJSON.photoId;
                        insPhoto.width = responseJSON.width;
                        insPhoto.height = responseJSON.height;
                        insPhoto.thumbwidth = responseJSON.thumbWidth;
                        insPhoto.thumbheight = responseJSON.thumbHeight;
                        insPhoto.fileUrl = responseJSON.fileUrl;
                        insPhoto.thumbnailFileUrl = responseJSON.thumbnailFileUrl;
                        insPhoto.fileFormat = responseJSON.fileFormat;
                        insPhoto.uploadedBy = responseJSON.uploadedBy;
                        insPhoto.uploadedTime = responseJSON.uploadedTime;
                        insPhoto.orgFileName = responseJSON.orgFileName;
                        if (!insPhoto.orgFileName) {
                            insPhoto.orgFileName = name;
                        }
                        insPhoto.exifTags = responseJSON.exitTags;

                        that.arUpdPhotos.every((value) => {
                            if (value.ID === +id) {
                                insPhoto.title = value.Title;
                                insPhoto.desp = value.Desp;
                                insPhoto.isPublic = value.IsPublic;
                                return true;
                            }
                        });

                        if (!insPhoto.title) {
                            insPhoto.title = insPhoto.orgFileName;
                        }
                        if (!insPhoto.desp) {
                            insPhoto.desp = insPhoto.orgFileName;
                        }

                        that.photoservice.createFile(insPhoto).subscribe(x => {
                            if (DebugLogging) {
                                console.log("Record created successfully!");
                            }

                            that.aruploadflags.forEach((value, index) => {
                                if (+value.id === +id) {
                                    value.success = true;
                                }
                            });

                            that.photoHadUploaded.push(insPhoto);

                            that.createAlbumPhotoLinkage();
                        }, error => {
                            if (DebugLogging) {
                                console.log("Record created failed: " + error);
                            }
                        });
                    },
                    onAllComplete: function (succids, failids) {
                        if (DebugLogging) {
                            console.log("OnAllComplete: Succeed array is " + succids.toString() + "; Failed array is " + failids.toString());
                        }
                        if (failids && failids.length > 0) {
                            // Error occurred!
                        } else {
                            // All succeed!
                            if (DebugLogging) {
                                console.log("All completed successfully!");
                            }
                            // Check whether need create to album
                            if (+that.assignAlbum === 2) {
                                that.albumservice.createAlbum(that.albumcreate);
                            }
                            else {
                                // Navigate!
                                that.onAfterUploadComplete(null);
                            }
                        }
                    },
                    onStatusChange: function (id: number, oldstatus, newstatus) {
                        if (DebugLogging) {
                            console.log("Entering OnStatusChanged of PhotoUploadComponent upon ID: " + id.toString() + "; From " + oldstatus + " to " + newstatus);
                        }
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
                        if (DebugLogging) {
                            console.log("Entering onSubmit of PhotoUploadComponent: " + id.toString() + " " + name);
                        }
                    },
                    onSubmitted: function (id: number, name: string) {
                        if (DebugLogging) {
                            console.log("Entering onSubmitted of PhotoUploadComponent: " + id.toString() + " " + name);
                        }
                        if (that.uploader) {
                            var fObj = that.uploader.getFile(id);
                            //that.uploader.setName(that.uploader.getUuid(id));
                            that.readImage(id, fObj, name, that.arUpdPhotos);
                        } else {
                            let errormsg = "Failed to process File " + name;
                            that.dlgservice.confirm(errormsg);
                        }
                    },
                    onTotalProgress: function (totalUploadedBytes: number, totalBytes: number) {
                        if (DebugLogging) {
                            console.log("Entering OnTotalProgress of PhotoUploadComponent: " + totalUploadedBytes.toString() + " of " + totalBytes.toString());
                        }
                        if (totalBytes > 0 && totalUploadedBytes > 0) {
                            that.onUploadProgress(100 * totalUploadedBytes / totalBytes);
                        }                        
                    },
                    onUpload: function (id: number, name: string) {
                        if (DebugLogging) {
                            console.log("Entering OnUpload of PhotoUploadComponent: " + id.toString() + ", " + name);
                        }
                    },
                    onValidate: function (data) {
                        if (DebugLogging) {
                            console.log("Entering OnValidate of PhotoUploadComponent: ");
                            //console.log(data);
                        }
                        return true;
                    }
                }
            });
        }
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of PhotoUploadComponent");
        }
        if (this.subUpdProgress) {
            this.subUpdProgress.unsubscribe();
            this.subUpdProgress = null;
        }
        if (this.subAlbumCreated) {
            this.subAlbumCreated.unsubscribe();
            this.subAlbumCreated = null;
        }
    }

    getcustomHeader() {
        var obj = {
            Authorization: 'Bearer ' + this.authservice.authSubject.getValue().getAccessToken()
        };
        return obj;
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
        // Elder version for handling file uploading
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
                    // Commit the follow line because the logic has been changed
                    //this.readImage(i, file, this.arUpdPhotos);
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
                updPhoto.Title = file.name;
                updPhoto.Desp = file.name;
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
        if (DebugLogging) {
            console.log("Entering onUploadProgress: " + data);
        }
        this.zone.run(() => {
            this.progressNum = +data;
        });
    }

    onSubmit(event) {
        // Ensure the uploading criteria
        if (!this.arUpdPhotos || this.arUpdPhotos.length <= 0) {
            this.dlgservice.confirm("Select photos before uploading!");
            return;
        }

        this.aruploadflags = [];
        this.arUpdPhotos.forEach((value, index) => {
            this.aruploadflags.push({ id: value.ID, success: false });
        });

        if (this.assignAlbum === 2) {
            // Check the album is valid or not
            if (!this.albumcreate.Title) {
                this.dlgservice.confirm("Title is a must for creating an album!");
                return;
            }
            this.albumcreate.CreatedAt = new Date();
            this.albumcreate.CreatedBy = this.authservice.authSubject.getValue().getUserName();
            this.aruploadflags.push({ id: 'Album', success: false });
        }

        this.isUploading = true;
        this.uploader.uploadStoredFiles();
    }

    onAfterUploadComplete(data: any = null) {
         if (DebugLogging) {
            console.log("Entering onAfterUploadComplete of PhotoUploadComponent: Navigation!");
        }
        this.isUploading = false;
        this.router.navigate(['/photo']);
    }

    afterAlbumCreated(data: any) {
        // Add the photos to this new created album
        if (DebugLogging) {
            console.log("Entering afterAlbumCreated of PhotoUploadComponent: Assign uploaded photo to new created album");
            console.log(data);
        }

        this.albumcreate.Id = +data.id;

        this.aruploadflags.forEach(value => {
            if (value.id === 'Album') {
                value.success = true;
            }
        });

        this.createAlbumPhotoLinkage();
    }

    createAlbumPhotoLinkage() {
        // Add the photos to this new created album
        if (DebugLogging) {
            console.log("Entering createAlbumPhotoLinkage of PhotoUploadComponent: Assign uploaded photo to new created album");
        }

        if (this.aruploadflags.every(value => value.success == true)) {
            if (DebugLogging) {
                console.log("All items have success flag set, continuing...");
            }
        } else {
            if (DebugLogging) {
                console.log("Not all items have success flag, quiting...");
            }

            return;
        }

        let apba = new AlbumPhotoByAlbum();
        apba.AlbumId = this.albumcreate.Id;
        apba.PhotoIDList = new Array<string>();
        for (let i = 0; i < this.photoHadUploaded.length; i++) {
            apba.PhotoIDList.push(this.photoHadUploaded[i].photoId);
        }

        this.albumservice.updateAlbumPhotoByAlbum(apba).subscribe(
            x => {
                this.onAfterUploadComplete(null);
            },
            error => {
                if (DebugLogging) {
                    console.log("Failed to assign photo to new created album: " + error);
                }
            }
        );
        this.photoHadUploaded = [];
    }
}

