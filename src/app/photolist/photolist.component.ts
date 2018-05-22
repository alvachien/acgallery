import { Component, NgZone, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar, PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
import { LogLevel, Album, AlbumPhotoByAlbum, Photo, UpdPhoto, } from '../model';
import { environment } from '../../environments/environment';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photolist',
  templateUrl: './photolist.component.html',
  styleUrls: ['./photolist.component.css']
})
export class PhotolistComponent implements OnInit, OnDestroy {
  public photos: Photo[] = [];
  public photoAmount: number;
  public selectedPhoto: Photo = null;
  private gallery: any = null;
  pageSize = 20;
  pageSizeOptions = [20, 40, 60, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // Layout
  clnGridCount: number;
  private _watcherMedia: Subscription;
  activeMediaQuery = '';

  constructor(private _zone: NgZone,
    private _router: Router,
    private _route: ActivatedRoute,
    private _viewContainerRef: ViewContainerRef,
    private _uistatusService: UIStatusService,
    private _media: ObservableMedia,
    private _photoService: PhotoService,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotolistComponent');
    }

    this.photoAmount = 0;
    this.clnGridCount = 3; // Default

    this._watcherMedia = this._media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of PhotolistComponent: ${this.activeMediaQuery}`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change.mqAlias === 'xs') {
        this.clnGridCount = 1;
      } else if (change.mqAlias === 'sm') {
        this.clnGridCount = 2;
      } else if (change.mqAlias === 'md') {
        this.clnGridCount = 3;
      } else if (change.mqAlias === 'lg') {
        this.clnGridCount = 4;
      } else {
        this.clnGridCount = 6;
      }
    });
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit of PhotolistComponent');
    }

    this._loadPhotoIntoPage(0);
  }

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();
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
    this.pageSize = this.pageEvent.pageSize;
    const skipamt = this.pageEvent.pageIndex * this.pageEvent.pageSize;
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
