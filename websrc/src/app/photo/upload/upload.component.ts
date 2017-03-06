import { Component, OnInit, AfterViewInit, 
    OnDestroy, NgZone, ViewChild, ElementRef, 
    Renderer, ViewContainerRef  }               from '@angular/core';
import { Router }                               from '@angular/router';
import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';
import { ITdDataTableColumn }                   from '@covalent/data-table';
import { TdDialogService }                      from '@covalent/core';

import { UIRadioButton }                        from '../../model/common';
import { Photo, UpdPhoto }                      from '../../model/photo';
import { Album, AlbumPhotoByAlbum }             from '../../model/album';
import { PhotoService }                         from '../../services/photo.service';
import { AlbumService }                         from '../../services/album.service';
import { AuthService }                          from '../../services/auth.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'acgallery-photo-upload',
  providers: [ MdSnackBar ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, AfterViewInit, OnDestroy {
    
    public arUpdPhotos: UpdPhoto[] = [];
    private albumPhotoLink: AlbumPhotoByAlbum;
    public IsUploading: boolean = false;
    private _snackBarConfig: MdSnackBarConfig;    
    private photoMaxKBSize: number = 9000;
    private photoMinKBSize: number = 20;
    private albumcreate: Album;

    public albumOptions: Array<UIRadioButton>;
    public selectedAlbumOption: number = 0;

    private uploader: any = null;
    @ViewChild('uploadFileRef') elemUploadFile;

    clnUpdPhotos: ITdDataTableColumn[] = [
        { name: 'ID',  label: 'ID' },
        { name: 'OrgName', label: 'Org. Name' },
        { name: 'Size', label: 'Size' },
        { name: 'Dimension', label: 'Dimension' }
    ];

    constructor(
        private zone: NgZone,
        private router: Router,
        private photoservice: PhotoService,
        private authservice: AuthService,
        private renderer: Renderer,
        private elm: ElementRef,
        private albumservice: AlbumService,
        private _viewContainerRef: ViewContainerRef,
        private _snackBar: MdSnackBar,
        private _dialogService: TdDialogService) {
        this._snackBarConfig = new MdSnackBarConfig();
        this._snackBarConfig.duration = 1500;

        if (environment.DebugLogging) {
            console.log("Entering constructor of PhotoUploadComponent");
        }

        this.albumcreate = new Album();
        this.albumPhotoLink = new AlbumPhotoByAlbum();        
        this.albumOptions = new Array<UIRadioButton>();

        // Set the radio button
        let rb : UIRadioButton = new UIRadioButton();
        rb.label = "Not assign to album";
        rb.value = 0;
        this.albumOptions.push(rb);
        rb = new UIRadioButton();
        rb.label = "Assign to existing album";
        rb.value = 1;
        this.albumOptions.push(rb);
        rb = new UIRadioButton();
        rb.label = "Create an album and assign";
        rb.value = 2; // Todo: switch to const
        this.albumOptions.push(rb);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
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
                    //minSizeLimit: that.photoMinKBSize * 1024,
                    sizeLimit: that.photoMaxKBSize * 1024
                },
                callbacks: {
                    onComplete: function (id, name, responseJSON) {
                        if (environment.DebugLogging) {
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
                            if (environment.DebugLogging) {
                                console.log("Record created successfully!");
                            }

                            // Update the link
                            that.albumPhotoLink.PhotoIDList.push(insPhoto.photoId);
                        }, error => {
                            if (environment.DebugLogging) {
                                console.log("Record created failed: " + error);
                            }
                        });
                    },
                    onAllComplete: function (succids, failids) {
                        if (environment.DebugLogging) {
                            console.log("OnAllComplete: Succeed array is " + succids.toString() + "; Failed array is " + failids.toString());
                        }

                        this.IsUploading = false;
                        
                        if (succids && succids.length > 0) {
                            // Succeed
                            if (that.selectedAlbumOption === 2) { // Todo: switch to const
                                // Create the linkage
                                that.createAlbumPhotoLinkage();
                            }
                        }
                        if (failids && failids.length > 0) {
                            // Error occurred!
                            // Todo: display errors
                            // Todo: also list
                        }
                    },
                    onSubmit: function (id: number, name: string) {
                        if (environment.DebugLogging) {
                            console.log("Entering onSubmit of PhotoUploadComponent: " + id.toString() + " " + name);
                        }
                    },
                    onSubmitted: function (id: number, name: string) {
                        if (environment.DebugLogging) {
                            console.log("Entering onSubmitted of PhotoUploadComponent: " + id.toString() + " " + name);
                        }
                        if (that.uploader) {
                            var fObj = that.uploader.getFile(id);
                            //that.uploader.setName(that.uploader.getUuid(id));
                            that.readImage(id, fObj, name, that.arUpdPhotos);
                        } else {
                            let errormsg = "Failed to process File " + name;
                            that.showSnackBar(errormsg, "");
                        }
                    },
                    onValidate: function (data) {
                        if (environment.DebugLogging) {
                            console.log("Entering OnValidate of PhotoUploadComponent.");
                        }
                        return true;
                    },
                    onStatusChange: function (id: number, oldstatus, newstatus) {
                        if (environment.DebugLogging) {
                            console.log("Entering OnStatusChanged of PhotoUploadComponent upon ID: " + id.toString() + "; From " + oldstatus + " to " + newstatus);
                        }
                        if (newstatus === "rejected") {
                            let errormsg = "File size must smaller than " + that.photoMaxKBSize + " and larger than " + that.photoMinKBSize;
                            that.showSnackBar(errormsg, "");
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
                    onUpload: function (id: number, name: string) {
                        if (environment.DebugLogging) {
                            console.log("Entering OnUpload of PhotoUploadComponent: " + id.toString() + ", " + name);
                        }
                    }
                }
            });
        }
    }

    ngOnDestroy() {
    }

    getcustomHeader() {
        var obj = {
            Authorization: 'Bearer ' + this.authservice.authSubject.getValue().getAccessToken()
        };
        return obj;
    }
    
    onSubmit(event) {
        // Perform UI checks
        if (!this.arUpdPhotos || this.arUpdPhotos.length <= 0) {
            this.showErrorDialog("Select photos before submitting");
            return;
        }
        if (this.selectedAlbumOption === 2) {
            // Check the album is valid or not
            if (!this.albumcreate.Title) {
                this.showErrorDialog("Title is a must for creating an album");
                //this.dlgservice.confirm("Title is a must for creating an album!");
                return;
            }
        }

        if (this.selectedAlbumOption === 2) {
            this.albumcreate.CreatedAt = new Date();
            this.albumcreate.CreatedBy = this.authservice.authSubject.getValue().getUserName();

            this.albumservice.createAlbum(this.albumcreate).subscribe(x => {
                this.albumcreate.Id = +x.id;
                
                // Prepare the table for linkage
                this.albumPhotoLink.AlbumId = +x.id;

                // Complete
                this.IsUploading = true;
                this.uploader.uploadStoredFiles();
            }, error => {
                // Error occurred
                this.showErrorDialog("Error occurred in album creation: " + error);
                return;
            }, () => {
                // Finally
            });
        }
        else if (this.selectedAlbumOption === 1 ){
            // Todo: assign to existing album

        } 
        else {
            this.IsUploading = true;
            this.uploader.uploadStoredFiles();
        }
    }

    isAssginToExistingAlbum(): boolean {
        return 1 === +this.selectedAlbumOption;
    }

    isAssginToNewAlbum(): boolean {
        return 2 === +this.selectedAlbumOption;
    }

    showSnackBar(message: string, title: string): void {
        let snackBarRef: MdSnackBarRef<any> = this._snackBar.open(message, title, this._snackBarConfig);
        // setTimeout(() => {
        //     snackBarRef.dismiss();
        // }, 3000);
        if (snackBarRef) {
            // Do nothing.
        }
    }

    showErrorDialog(message: string) {
        this._dialogService.openAlert({
            message: message,
            disableClose: false, // defaults to false
            viewContainerRef: this._viewContainerRef, //OPTIONAL
            title: 'Error', //OPTIONAL, hides if not provided
            closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
        });
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
                // Default tile and desp
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

    private createAlbumPhotoLinkage() : void {
        // Add the photos to this new created album
        if (environment.DebugLogging) {
            console.log("Entering createAlbumPhotoLinkage of UploadComponent: Assign uploaded photo to new created album");
        }

        this.albumservice.updateAlbumPhotoByAlbum(this.albumPhotoLink).subscribe(
            x => {
                //this.onAfterUploadComplete(null);
            },
            error => {
                if (environment.DebugLogging) {
                    console.log("Failed to assign photo to new created album: " + error);
                }
            },
            () => {
                // 
            }
        );
    }
}
