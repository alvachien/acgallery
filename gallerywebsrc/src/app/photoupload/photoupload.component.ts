import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'fine-uploader';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { Album, AlbumPhotoByAlbum } from '../model/album';
import { Photo, UpdPhoto } from '../model/photo';
import { LogLevel } from '../model/common';
import { environment } from '../../environments/environment';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'acgallery-photoupload',
  templateUrl: './photoupload.component.html',
  styleUrls: ['./photoupload.component.css']
})
export class PhotouploadComponent implements OnInit, AfterViewInit, OnDestroy {
  public progressNum: number = 0;
  public isUploading: boolean = false;
  public assignAlbum: number = 0;

  public photoMaxKBSize: number = 0;
  public photoMinKBSize: number = 0;
  public arUpdPhotos: UpdPhoto[] = [];
  private photoHadUploaded: Photo[] = [];
  public uploader: any = null;
  public canCrtAlbum: boolean;
  public albumCreate: Album;
  public allAlbum: Album[] = [];
  @ViewChild('uploadFileRef') elemUploadFile;

  constructor(private _zone: NgZone,
    private _router: Router,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _elmRef: ElementRef,
    public _snackBar: MdSnackBar) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering onSubmit of PhotoUploadComponent");
    }

    this._authService.authContent.subscribe((x) => {
      if (x.canUploadPhoto()) {
        let sizes = x.getUserUploadKBSize();
        this.photoMinKBSize = sizes[0];
        this.photoMaxKBSize = sizes[1];
      } else {
        this.photoMinKBSize = 0;
        this.photoMaxKBSize = 0;
      }
    });
    this.canCrtAlbum = this._authService.authSubject.getValue().canCreateAlbum();
    this.albumCreate = new Album();
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering ngOnInit of PhotoUploadComponent");
    }
  }

  ngAfterViewInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering ngAfterViewInit of PhotoUploadComponent");
    }

    let that = this;
    if (!this.uploader && that.elemUploadFile) {
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
          onComplete: function (id: number, name, responseJSON) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onComplete of PhotoUploadComponent upon ID: " + id.toString() + "; name: " + name);
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

            if (!insPhoto.title) {
              insPhoto.title = insPhoto.orgFileName;
            }
            if (!insPhoto.desp) {
              insPhoto.desp = insPhoto.orgFileName;
            }

            that._photoService.createFile(insPhoto).subscribe(x => {
              if (environment.LoggingLevel >= LogLevel.Debug) {
                console.log("ACGallery [Debug]: Record created successfully: " + x);
              }

              that.photoHadUploaded.push(insPhoto);

              //that.createAlbumPhotoLinkage();
            }, error => {
              if (environment.LoggingLevel >= LogLevel.Debug) {
                console.log("ACGallery [Debug]: Record created failed: " + error);
              }
            });
          },
          onAllComplete: function (succids, failids) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("Entering uploader_onAllComplete of uploader_onAllComplete with succids: " + succids.toString() + "; failids: " + failids.toString());
            }

            if (that.isAssginToNewAlbum()) {
              that.createAlbumPhotoLinkage();
            }
          },
          onStatusChange: function (id: number, oldstatus, newstatus) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("Entering uploader_onStatusChange of PhotoUploadComponent upon ID: " + id.toString() + "; From " + oldstatus + " to " + newstatus);
            }

            if (newstatus === "rejected") {
              let errormsg = "File size must smaller than " + that.photoMaxKBSize + " and larger than " + that.photoMinKBSize;
              that._snackBar.open(errormsg);
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
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onSubmit of PhotoUploadComponent upon ID: " + id.toString() + "; name: " + name);
            }
          },
          onSubmitted: function (id: number, name: string) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onSubmitted of PhotoUploadComponent upon ID: " + id.toString() + "; name: " + name);
            }

            if (that.uploader) {
              var fObj = that.uploader.getFile(id);
              that.readImage(id, fObj, name, that.arUpdPhotos);
            } else {
              let errormsg = "Failed to process File " + name;
              that._snackBar.open(errormsg);
            }
          },
          onTotalProgress: function (totalUploadedBytes: number, totalBytes: number) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onTotalProgress of PhotoUploadComponent with totalUploadedBytes: " + totalUploadedBytes.toString() + "; totalBytes: " + totalUploadedBytes.toString());
            }

            that.onUploadProgress(Math.floor(100 * totalUploadedBytes / totalBytes));
          },
          onUpload: function (id: number, name: string) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onUpload of PhotoUploadComponent upon ID: " + id.toString() + "; name: " + name);
            }
          },
          onValidate: function (data) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log("ACGallery [Debug]: Entering uploader_onValidate of PhotoUploadComponent with data: " + data);
            }
          }
        }
      });
    }
  }

  ngOnDestroy() {
  }

  onSubmit($event): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering onSubmit of PhotoUploadComponent");
    }

    if (!this.uploader) {
      this._snackBar.open("Fatal error: uploader not initialized yet!");
      return;
    }

    // Photo have been choosed already
    if (!this.arUpdPhotos || this.arUpdPhotos.length <= 0) {
      this._snackBar.open("Select photos before uploading!");
      return;
    }

    if (this.isAssginToNewAlbum()) {
      // Check the validity of New Album
      if (!this.albumCreate.Title) {
        this._snackBar.open("Title is a must for creating an album!");
        return;
      }
      this.albumCreate.CreatedAt = new Date();

      this._albumService.createAlbum(this.albumCreate).subscribe(x => {
        this.albumCreate.Id = +x.id;
        this.doRealUpload();
      }, error => {

      }, () => {

      });
    } else if (this.isAssginToExistingAlbum()) {

    } else {
      this.doRealUpload();
    }
  }

  private doRealUpload(): void {
    // Now the do the real upload
    this.isUploading = true;
    this.photoHadUploaded = [];
    this.uploader.uploadStoredFiles();
  }

  getcustomHeader() {
    var obj = {
      Authorization: 'Bearer ' + this._authService.authSubject.getValue().getAccessToken()
    };
    return obj;
  }

  onAssignAblumClick(num: number | string) {
    this._zone.run(() => {
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

  onUploadProgress(data: number) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Uploading progress: " + +data);
    }

    this._zone.run(() => {
        this.progressNum = +data;
    });
  }

  private readImage(fid: number, file, nname, arPhotos: UpdPhoto[]) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering onSubmit of PhotoUploadComponent");
    }

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

  createAlbumPhotoLinkage() {
    // Add the photos to this new created album
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACGallery [Debug]: Entering createAlbumPhotoLinkage of PhotoUploadComponent: Assign uploaded photo to new created album");
    }

    let apba = new AlbumPhotoByAlbum();
    apba.AlbumId = this.albumCreate.Id;
    apba.PhotoIDList = new Array<string>();
    for (let i = 0; i < this.photoHadUploaded.length; i++) {
      apba.PhotoIDList.push(this.photoHadUploaded[i].photoId);
    }

    this._albumService.updateAlbumPhotoByAlbum(apba).subscribe(
      x => {
        this.onAfterUploadComplete();
      },
      error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.log("ACGallery [Error]: Failed to assign photo to new created album: " + error);
        }
      }
    );
    this.photoHadUploaded = [];
  }

  private onAfterUploadComplete(): void {
    // Show a dialog
    this._snackBar.open("All photos completed!");
  }
}
