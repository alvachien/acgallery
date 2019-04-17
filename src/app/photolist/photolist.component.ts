import { Component, NgZone, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar, PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
import { LogLevel, Album, AlbumPhotoByAlbum, Photo, UpdPhoto } from '../model';
import { environment } from '../../environments/environment';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { takeUntil } from 'rxjs/operators';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photolist',
  templateUrl: './photolist.component.html',
  styleUrls: ['./photolist.component.css'],
})
export class PhotolistComponent implements OnInit, OnDestroy {
  private gallery: any = null;
  private _destroyed$: ReplaySubject<boolean>;
  public photos: Photo[] = [];
  public photoAmount: number;
  public selectedPhoto: Photo = null;
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
    private _media: MediaObserver,
    private _photoService: PhotoService,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotolistComponent');
    }

    this.photoAmount = 0;
    this.clnGridCount = 3; // Default
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent ngOnInit...');
    }

    this._destroyed$ = new ReplaySubject(1);
    this._watcherMedia = this._media.asObservable()
      .pipe(takeUntil(this._destroyed$)).subscribe((change: MediaChange[]) => {
      this.activeMediaQuery = change ? `'${change[0].mqAlias}' = (${change[0].mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering PhotolistComponent, ngOnInit, MediaServer: ${this.activeMediaQuery}`);
      }

      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change[0].mqAlias === 'xs') {
        this.clnGridCount = 1;
      } else if (change[0].mqAlias === 'sm') {
        this.clnGridCount = 2;
      } else if (change[0].mqAlias === 'md') {
        this.clnGridCount = 3;
      } else if (change[0].mqAlias === 'lg') {
        this.clnGridCount = 4;
      } else {
        this.clnGridCount = 6;
      }
    });

    this._loadPhotoIntoPage(0);
  }

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();

    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  onPhotoClick(idx: number): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent onPhotoClick...');
    }

    if (this.photos.length <= 0) {
      return;
    }

    const items = [];
    for (const pht of this.photos) {
      items.push({
        src: pht.fileInAPIUrl,
        w: pht.width,
        h: pht.height,
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
      index: idx2, // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe(this._uistatusService.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  onViewPhotoEXIFDialog(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent onViewPhotoEXIFDialog...');
    }

    this._uistatusService.selPhotoInPhotoList = photo;

    const dialogRef = this._dialog.open(PhotoListPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe((result: any) => {
      this._uistatusService.selPhotoInPhotoList = null;
    });
  }

  public onDisplayPhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent onDisplayPhoto...');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/display']);
  }

  public onChangePhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent onChangePhoto...');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/edit']);
  }

  public onDeletePhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering PhotolistComponent onDeletePhoto...');
    }

    this._photoService.deletePhoto(photo).subscribe((x: any) => {
      // Do nothing
    }, (error: any) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: Entering PhotolistComponent, onDeletePhoto, failed with : ${error}`);
      }
    }, () => {
      // Do nothing
    });
  }

  public onPageEvent($event: any) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Gallery [Debug]: Entering PhotolistComponent onPageEvent...');
    }

    this.pageEvent = $event;
    this.pageSize = this.pageEvent.pageSize;
    const skipamt = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._photoService.loadPhotos(this.pageSize, skipamt).subscribe((data: any) => {
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
      this._snackBar.open('Error occurred: ' + error.message, undefined, {
        duration: 3000,
      });
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
