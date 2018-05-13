import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
import { LogLevel, Album, AlbumPhotoByAlbum, Photo, UpdPhoto, UIPagination } from '../model';
import { environment } from '../../environments/environment';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photolist',
  templateUrl: './photolist.component.html',
  styleUrls: ['./photolist.component.css']
})
export class PhotolistComponent implements OnInit {
  public photos: Photo[] = [];
  public selectedPhoto: Photo = null;
  public objUtil: UIPagination;
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

    this.objUtil = new UIPagination(20, 5);
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit of PhotolistComponent');
    }

    this.onPageClick(1);
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

  onPagePreviousClick(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onPagePreviousClick of PhotolistComponent');
    }

    if (this.objUtil.currentPage > 1) {
      this.onPageClick(this.objUtil.currentPage - 1);
    }
  }

  onPageNextClick(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onPageNextClick of PhotolistComponent');
    }

    this.onPageClick(this.objUtil.currentPage + 1);
  }

  onPageClick(pageIdx: number): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onPageClick of PhotolistComponent');
    }

    if (this.objUtil.currentPage !== pageIdx) {
      this.objUtil.currentPage = pageIdx;

      const paraString = this.objUtil.nextURLString;
      this._photoService.loadPhotos(paraString).subscribe(data => {
        this.objUtil.totalCount = data.totalCount;
        this._zone.run(() => {
          this.photos = [];
          if (data && data.contentList && data.contentList instanceof Array) {
            for (const ce of data.contentList){
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
