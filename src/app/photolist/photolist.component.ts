import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar, PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
import { LogLevel, Album, AlbumPhotoByAlbum, Photo, UpdPhoto, } from '../model';
import { environment } from '../../environments/environment';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photolist',
  templateUrl: './photolist.component.html',
  styleUrls: ['./photolist.component.css']
})
export class PhotolistComponent implements OnInit {
  public photos: Photo[] = [];
  public photoAmount: number;
  public selectedPhoto: Photo = null;
  private gallery: any = null;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private _zone: NgZone,
    private _router: Router,
    private _route: ActivatedRoute,
    private _viewContainerRef: ViewContainerRef,
    private _uistatusService: UIStatusService,
    private _photoService: PhotoService,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotolistComponent');
    }

    this.photoAmount = 0;
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit of PhotolistComponent');
    }

    this._loadPhotoIntoPage(0);
  }

  onPhotoClick(idx: number): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onPhotoClick of PhotolistComponent');
    }

    if (this.photos.length <= 0) {
      return;
    }

    const items = [];
    for (const pht of this.photos) {
      items.push({
        src: pht.fileInAPIUrl,
        w: pht.width,
        h: pht.height
      });
    }

    let idx2: number;
    if (!idx) {
      idx2 = 0;
    } else if (idx < 0 || idx > this.photos.length) {
      idx2 = 0;
    } else {
      idx2 = idx;
    }

    // define options (if needed)
    const options: any = {
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: idx2 // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe(this._uistatusService.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  onViewPhotoEXIFDialog(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onViewPhotoEXIFDialog of PhotolistComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;

    const dialogRef = this._dialog.open(PhotoListPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe(result => {
      this._uistatusService.selPhotoInPhotoList = null;
    });
  }

  public onDisplayPhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onDisplayPhoto of PhotolistComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/display']);
  }

  public onChangePhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onChangePhoto of PhotolistComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/edit']);
  }

  public onPageEvent($event: any) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Gallery [Debug]: Entering onPageEvent of PhotolistComponent');
    }

    this.pageEvent = $event;

    const skipamt = this.pageEvent.pageIndex * this.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._photoService.loadPhotos(this.pageSize, skipamt).subscribe(data => {
      this._zone.run(() => {
        this.photos = [];
        this.photoAmount = data.totalCount;
        if (data && data.contentList && data.contentList instanceof Array) {
          for (const ce of data.contentList) {
            const pi: Photo = new Photo();
            pi.init(ce);
            this.photos.push(pi);
          }
        }
      });
    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Error occurred: ' + error.message);
    }, () => {
    });
  }
}

@Component({
  selector: 'photolist-photoexif-dialog',
  templateUrl: './photolist.photoexif.dialog.html',
})
export class PhotoListPhotoEXIFDialog {
  public currentPhoto: any;

  constructor(public _dialogRef: MatDialogRef<PhotoListPhotoEXIFDialog>,
    public _uistatus: UIStatusService) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: Entering constructor of PhotoListPhotoEXIFDialog');
      }

      this.currentPhoto = this._uistatus.selPhotoInPhotoList;
  }
}
