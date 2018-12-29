import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef,
  Inject, } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { FineUploaderBasic } from 'fine-uploader/lib/core';
import { AuthService, PhotoService, AlbumService, UserDetailService } from '../services';
import { Album, AlbumPhotoLink, AlbumPhotoByAlbum } from '../model/album';
import { LogLevel, Photo, UpdPhoto } from '../model';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatPaginator, MatTableDataSource, MatButton, MatVerticalStepper, MatChipInputEvent,
  MatDialogRef, MAT_DIALOG_DATA, MatDialog, } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

export interface RenamingDialogData {
  prefixName: string;
  seqNumber: number;
}

@Component({
  selector: 'acgallery-photoupload',
  templateUrl: './photoupload.component.html',
  styleUrls: ['./photoupload.component.css'],
})
export class PhotouploadComponent implements OnInit, AfterViewInit, OnDestroy {
  public progressNum = 0;
  public isUploading = false;
  public assignMode = 0;
  // Enter, comma
  separatorKeysCodes: any[] = [ENTER, COMMA];
  // Renaming
  public renamingInfo: RenamingDialogData = {
    prefixName: 'Photo',
    seqNumber: 1
  };

  private _photoMinKBSize: number;
  private _photoMaxKBSize: number;
  private _canCrtAlbum: boolean;
  private photoHadUploaded: Photo[] = [];
  public uploader: any = null;
  public albumCreate: Album;
  public arAssignMode: any[] = [];
  @ViewChild('uploadFileRef') elemUploadFile: MatButton;
  @ViewChild(MatPaginator) paginatorPhoto: MatPaginator;
  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

  displayedColumns = ['thumbnail', 'id', 'name', 'size', 'dimension', 'ispublic', 'title', 'desp', 'tag'];
  dataSource = new MatTableDataSource<UpdPhoto>([]);
  displayedAlbumColumns = ['select', 'id', 'thumbnail', 'title'];
  dataSourceAlbum = new MatTableDataSource<Album>([]);
  selection = new SelectionModel<Album>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceAlbum.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceAlbum.data.forEach((row: any) => this.selection.select(row));
  }

  constructor(private _zone: NgZone,
    private _router: Router,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _userdetailService: UserDetailService,
    private _dialog: MatDialog,
    private _elmRef: ElementRef,
    private _snackBar: MatSnackBar) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotoUploadComponent.');
    }

    this._canCrtAlbum = this._userdetailService.UserDetailInfo.albumCreate;
    this._photoMinKBSize = this._userdetailService.UserDetailInfo.uploadFileMinSize;
    this._photoMaxKBSize = this._userdetailService.UserDetailInfo.uploadFileMaxSize;

    this.albumCreate = new Album();
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit of PhotoUploadComponent');
    }

    if (!this.canUploadPhoto()) {
      this._router.navigate(['/unauthorized']);
      return;
    }

    // Assign modes
    this.arAssignMode.push({
      Value: 0,
      Name: 'Photo.Upload_NoAlbum',
    });
    this.arAssignMode.push({
      Value: 1,
      Name: 'Photo.Upload_AssignExistAlbum',
    });
    if (this._canCrtAlbum) {
      this.arAssignMode.push({
        Value: 2,
        Name: 'Photo.Upload_AssignNewAlbum',
      });
    }

    this.dataSource.paginator = this.paginatorPhoto;
    // this.dataSourceAlbum.paginator = this.paginatorAlbum;

    this._albumService.loadAlbums().subscribe((x: any) => {
      const allAlbum: Album[] = [];
      for (const alb of x.contentList) {
        const album = new Album();
        album.initex(alb);

        allAlbum.push(album);
      }

      this.dataSourceAlbum.data = allAlbum;
    });
  }

  ngAfterViewInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngAfterViewInit of PhotoUploadComponent');
    }

    const that = this;
    if (!this.uploader && that.elemUploadFile) {
      this.uploader = new FineUploaderBasic({
        // button: that.elemUploadFile.nativeElement,
        button: that.elemUploadFile._elementRef.nativeElement,
        autoUpload: false,
        request: {
          endpoint: environment.PhotoFileAPIUrl,
          customHeaders: that.getcustomHeader(),
        },
        validation: {
          allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
          minSizeLimit: that._photoMinKBSize * 1024,
          sizeLimit: that._photoMaxKBSize * 1024,
        },
        callbacks: {
          onComplete: (id: number, name, responseJSON) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onComplete of PhotoUploadComponent upon ID: '
                + id.toString() + '; name: ' + name);
            }

            if (!responseJSON.success) {
              return;
            }

            const insPhoto = new Photo();
            insPhoto.init(responseJSON);

            that.onSingleComplete(id, insPhoto);
          },
          onAllComplete: (succids, failids) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onAllComplete of PhotoUploadComponent with succids: '
                + succids.toString() + '; failids: ' + failids.toString());
            }

            that.onAllCompleted();
          },
          onStatusChange: (id: number, oldstatus, newstatus) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onStatusChange of PhotoUploadComponent upon ID: '
                + id.toString() + '; From ' + oldstatus + ' to ' + newstatus);
            }

            if (newstatus === 'rejected') {
              const errormsg = 'File size must smaller than ' + that._photoMaxKBSize + ' and larger than ' + that._photoMinKBSize;
              that._snackBar.open(errormsg, 'Close', {
                duration: 2000,
              });
            } else if (newstatus === 'upload_failed') {
              if (environment.LoggingLevel >= LogLevel.Error) {
                console.error('ACGallery [Debug]: Upload failed at ID: ' + id.toString());
              }
            }

            // SUBMITTED
            // QUEUED
            // UPLOADING
            // UPLOAD_RETRYING
            // UPLOAD_FAILED
            // UPLOAD_SUCCESSFUL
            // CANCELED
            // REJECTED
            // DELETED
            // DELETING
            // DELETE_FAILED
            // PAUSED
          },
          onSubmit: (id: number, name: string) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onSubmit of PhotoUploadComponent upon ID: '
                + id.toString() + '; name: ' + name);
            }
          },
          onSubmitted: (id: number, name: string) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onSubmitted of PhotoUploadComponent upon ID: '
                + id.toString() + '; name: ' + name);
            }

            if (that.uploader) {
              const fObj = that.uploader.getFile(id);
              that.readImage(id, fObj, name);
            } else {
              const errormsg = 'Failed to process File ' + name;
              that._snackBar.open(errormsg, 'Close', {
                duration: 2000,
              });
            }
          },
          onTotalProgress: (totalUploadedBytes: number, totalBytes: number) => {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('ACGallery [Debug]: Entering uploader_onTotalProgress of PhotoUploadComponent with totalUploadedBytes: '
                + totalUploadedBytes.toString() + '; totalBytes: ' + totalUploadedBytes.toString());
            }

            that.onUploadProgress(Math.floor(90 * totalUploadedBytes / totalBytes));
          },
          onUpload: (id: number, name: string) => {
            // Comment it out to reduce the log amount...
            // if (environment.LoggingLevel >= LogLevel.Debug) {
            //   console.log('ACGallery [Debug]: Entering uploader_onUpload of PhotoUploadComponent upon ID: '
            //     + id.toString() + '; name: ' + name);
            // }
          },
          onValidate: (data: any) => {
            // Comment it out to reduce the log amount...
            // if (environment.LoggingLevel >= LogLevel.Debug) {
            //   console.log('ACGallery [Debug]: Entering uploader_onValidate of PhotoUploadComponent with data: ' + data);
            // }
          },
        },
      });
    } else {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error('ACGallery [Error]: Failed to initialize the uploader control.');
      }

      // TBD: Error handling.
    }
  }

  ngOnDestroy() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnDestroy of PhotoUploadComponent');
    }
  }

  onSubmit(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onSubmit of PhotoUploadComponent');
    }

    if (!this.uploader) {
      this._snackBar.open('Fatal error: uploader not initialized yet!', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Photo have been choosed already
    if (!this.dataSource.data || this.dataSource.data.length <= 0) {
      this._snackBar.open('Select photos before uploading!', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (this.isAssginToNewAlbum()) {
      // Check the validity of New Album
      if (!this.albumCreate.Title) {
        this._snackBar.open('Title is a must for creating an album!', 'Close', {
          duration: 3000,
        });
        return;
      }
      this.albumCreate.CreatedAt = new Date();

      this._albumService.createAlbum(this.albumCreate).subscribe((x: any) => {
        this.albumCreate.Id = +x.id;

        this.doRealUpload();
      }, (error: any) => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('ACGallery [Error]: Error occurs in createAlbum in PhotoUploadComponent:');
          console.error(error);
        }
      }, () => {
      });
    } else if (this.isAssginToExistingAlbum()) {
      const nsel = this.selection.selected.length;

      if (nsel < 1) {
        this._snackBar.open('Select at least one album to continue!', 'Close', {
          duration: 2000,
        });
        return;
      }

      this.doRealUpload();
    } else {
      this.doRealUpload();
    }
  }

  onSingleComplete(id: number, insPhoto: Photo): void {
    // Read through the inputted data
    // for (let pht of this.arUpdPhotos) {
    for (const pht of this.dataSource.data) {
      if (pht.ID === id) {
        insPhoto.title = pht.Title ? pht.Title : pht.OrgName;
        insPhoto.desp = pht.Desp ? pht.Desp : pht.OrgName;
        insPhoto.isPublic = pht.IsPublic;
        if (!insPhoto.width && pht.Width) {
          insPhoto.width = pht.Width;
        }
        if (!insPhoto.height && pht.Height) {
          insPhoto.height = pht.Height;
        }
        if (pht.Tags && pht.Tags.length > 0) {
          insPhoto.tags = [];
          for (const tag of pht.Tags) {
            insPhoto.tags.push(tag);
          }
        }

        break;
      }
    }

    this.photoHadUploaded.push(insPhoto);
  }

  onAllCompleted(): void {
    this.onUploadProgress(95);

    const rxdata: Array<Observable<any>> = [];
    for (const pht of this.photoHadUploaded) {
      rxdata.push(this._photoService.createFile(pht));
    }

    forkJoin(rxdata).subscribe((data: any) => {
      if (this.assignMode !== 0) {
        const albumids: number[] = [];
        if (this.isAssginToNewAlbum()) {
          albumids.push(this.albumCreate.Id);
        } else {
          this.selection.selected.forEach((val: Album) => {
            albumids.push(val.Id);
          });
        }

        const rxdata2: Array<Observable<any>> = [];
        albumids.forEach((albid: number) => {
          for (const data_detail of data) {
            const apl: AlbumPhotoLink = new AlbumPhotoLink();
            apl.albumID = albid;
            apl.photoID = data_detail.photoId;
            rxdata2.push(this._albumService.createAlbumPhotoLink(apl));
          }
        });

        forkJoin(rxdata2).subscribe((data3: any) => {
          // Do nothing
        }, (error3: any) => {
          // TBD.
        }, () => {
          this.onAfterUploadComplete();
        });
      } else {
        this.onAfterUploadComplete();
      }
    }, (error: any) => {
      this._snackBar.open('Failed: reason: ' + error, 'Close', {
        duration: 3000,
      });
      this.onAfterUploadComplete();
    }, () => {
      // Do nothing
    });
  }

  getcustomHeader(): any {
    const obj: any = {
      Authorization: 'Bearer ' + this._authService.authSubject.getValue().getAccessToken(),
    };
    return obj;
  }

  onAssignAblumClick(num: number | string) {
    this._zone.run(() => {
      this.assignMode = +num;
    });
  }

  isAssginToExistingAlbum(): boolean {
    return 1 === +this.assignMode;
  }

  isAssginToNewAlbum(): boolean {
    return 2 === +this.assignMode;
  }

  canUploadPhoto(): boolean {
    return this._photoMaxKBSize > 0;
  }

  canCreateAlbum(): boolean {
    return this._canCrtAlbum;
  }

  onUploadProgress(data: number) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Uploading progress: ' + +data);
    }

    this._zone.run(() => {
      this.progressNum = +data;
    });
  }

  get isStepAddPhotoComplete(): boolean {
    return this.dataSource.data.length > 0;
  }
  get isStepAssignAlbumComplete(): boolean {
    let rst = false;
    switch (this.assignMode) {
      case 1:
      rst = this.selection.selected.length > 0;
      break;

      case 2:
      rst = this.albumCreate.isValid;
      break;

      case 0:
      default:
      rst = true;
      break;
    }
    return rst;
  }

  public onRenamingAll(): void {
    const dialogRef = this._dialog.open(PhotoRenamingDialog, {
      width: '250px',
      data: this.renamingInfo,
    });

    dialogRef.afterClosed().subscribe((result: RenamingDialogData) => {
      if (result) {
        this.renamingInfo = result;

        // Then rename all items
        if (!this.dataSource.data || this.dataSource.data.length <= 0) {
          // Do nothing
        } else {
          let ardata: UpdPhoto[] = this.dataSource.data.slice();
          ardata.forEach((val: any, index: number) => {
            val.Title = this.renamingInfo.prefixName + index.toString();
          });
          this.dataSource.data = ardata;
        }
      }
    });
  }

  public onAddTagsToAll(): void {
    
  }

  public addItemTag(row: UpdPhoto, $event: MatChipInputEvent): void {
    let input: any = $event.input;
    let value: any = $event.value;

    // Add new Tag
    if ((value || '').trim()) {
      row.Tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeItemTag(row: UpdPhoto, tag: any): void {
    let index: number = row.Tags.indexOf(tag);

    if (index >= 0) {
      row.Tags.splice(index, 1);
    }
  }

  private readImage(fid: number, file: any, nname: string) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering readImage of PhotoUploadComponent');
    }

    const reader: FileReader = new FileReader();

    reader.addEventListener('load', () => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: Entering event load of readImage in PhotoUploadComponent');
      }

      const image = new Image();
      image.src = <string>reader.result;
      image.addEventListener('load', () => {
        const updPhoto: UpdPhoto = new UpdPhoto();
        updPhoto.imgSrc = image.src;
        updPhoto.ID = +fid;
        updPhoto.OrgName = file.name;
        updPhoto.Name = nname;
        updPhoto.Width = +image.width;
        updPhoto.Height = +image.height;
        updPhoto.Title = file.name;
        updPhoto.Desp = file.name;
        const size: number = Math.round(file.size / 1024);
        updPhoto.Size = size.toString() + 'KB';

        if (size >= this._photoMaxKBSize || size <= this._photoMinKBSize) {
          updPhoto.ValidInfo = 'File ' + updPhoto.Name + ' with size (' + updPhoto.Size + ') which is larger than '
            + this._photoMaxKBSize + ' or less than ' + this._photoMinKBSize;
          updPhoto.IsValid = false;
        } else {
          updPhoto.IsValid = true;
        }

        const ardata: any[] = this.dataSource.data.slice();
        ardata.push(updPhoto);
        this.dataSource.data = ardata;
      });
    });

    reader.readAsDataURL(file);
  }

  private doRealUpload(): void {
    // Now the do the real upload
    this.photoHadUploaded = [];
    this._zone.run(() => {
      this.isUploading = true;
    });
    this.uploader.uploadStoredFiles();
  }

  private onAfterUploadComplete(): void {
    this.onUploadProgress(100);

    this.photoHadUploaded = [];

    // this._zone.run(() => {
    //   this.isUploading = false;
    //   this.stepper.reset();

    //   this.assignMode = 0;
    //   this.dataSource.data = [];
    //   this.selection.clear();
    //   this.albumCreate = new Album();
    //   this.progressNum = 0;
    // });

    // Show a dialog
    this._snackBar.open('All photos completed!', 'Close', {
      duration: 3000,
    }).afterDismissed().subscribe((x: any) => {
      // Dismissed of snackBar
      if (this.assignMode === 0) {
        // Jump to the photos list page
        this._router.navigate(['/photo']);
      } else if (this.isAssginToExistingAlbum()) {
        // Jump to the existing album page
        this._router.navigate(['/album/display/' + this.selection.selected[0].Id.toString()]);
      } else if (this.isAssginToNewAlbum()) {
        // Jump to the new album page
        this._router.navigate(['/album/display/' + this.albumCreate.Id.toString()]);
      }
    });
  }
}

@Component({
  selector: 'acgallery-photoupload-renaming-dialog',
  templateUrl: 'photo-renaming-dialog.html',
})
export class PhotoRenamingDialog {

  constructor(
    public dialogRef: MatDialogRef<PhotoRenamingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: RenamingDialogData) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}