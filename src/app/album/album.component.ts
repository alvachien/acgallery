import { Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  ViewContainerRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, forkJoin, Subscription, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MatDialogConfig, MatSnackBar, PageEvent, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import { environment } from '../../environments/environment';
import { UIMode, LogLevel, Album, Photo } from '../model';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean>;
  private _watcherMedia: Subscription;

  public objAlbum: Album = null;
  public photos: Photo[] = [];
  public photoAmount: number;
  public selectedPhoto: Photo;

  public uiMode: UIMode = UIMode.Display;
  public currentMode: string;
  private routerID: number;
  private gallery: any;
  pageSize = 20;
  pageSizeOptions = [20, 40, 60, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // Layout
  clnGridCount: number;
  activeMediaQuery = '';

  constructor(private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _uistatus: UIStatusService,
    private _media: ObservableMedia,
    private _viewContainerRef: ViewContainerRef,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AlbumComponent constructor');
    }
    this.objAlbum = new Album();
    this.photoAmount = 0;
    this.clnGridCount = 3; // Default
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AlbumComponent ngOnInit');
    }

    this._destroyed$ = new ReplaySubject(1);

    // Media observer
    this._watcherMedia = this._media.asObservable().pipe(takeUntil(this._destroyed$)).subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering AlbumComponent ngOnInit, MeidaChange: ${this.activeMediaQuery}`);
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

    // Distinguish current mode
    this._activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === 'create') {
          this.currentMode = 'Common.Create';
          this.objAlbum = new Album();
          this.uiMode = UIMode.Create;
        } else if (x[0].path === 'edit') {
          this.routerID = +x[1].path;

          this.currentMode = 'Common.Edit';
          this.uiMode = UIMode.Change;
        } else if (x[0].path === 'display') {
          this.routerID = +x[1].path;

          this.currentMode = 'Common.Display';
          this.uiMode = UIMode.Display;
        }
      }

      if (this.uiMode === UIMode.Display || this.uiMode === UIMode.Change) {
        // Read the album
        this._readAlbum();
      }
    }, (error: any) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: Entering AlbumComponent, ngOnInit, failed parsing URL: ${error}`);
      }
    }, () => {
      // Completed
    });
  }

  ngOnDestroy() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AlbumComponent ngOnDestroy');
    }
    if (this._watcherMedia) {
      this._watcherMedia.unsubscribe();
    }

    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  get isFieldChangable(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }
  get isCreateMode(): boolean {
    return this.uiMode === UIMode.Create;
  }

  public onPhotoClick(idx: number): void {
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
    const options = {
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: idx2, // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe(this._uistatus.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  public onViewPhotoEXIFDialog(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;

    const dialogRef = this._dialog.open(AlbumPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe((result: any) => {
      // Do nothing.
      this._uistatus.selPhotoInAblum = null;
    });
  }

  public onDisplayPhotoAssign(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;
    this._router.navigate(['/photo/display']);
  }

  public onChangePhotoAssign(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;
    this._router.navigate(['/photo/edit']);
  }

  public onSubmit() {
    // TBD.
  }
  public onCancel() {
    // TBD
  }

  public onPageEvent($event: any) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Gallery [Debug]: Entering AlbumComponent onPageEvent');
    }

    this.pageEvent = $event;
    this.pageSize = this.pageEvent.pageSize;
    const skipamt = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  // Open the dialog asking for Access Code
  private _openAccessCodeDialog(album: Album): Observable<any> {
    const dialogRef = this._dialog.open(AlbumAccessCodeDialog, {
      data: { hint: album.accessCodeHint },
    });
    return dialogRef.afterClosed();
  }

  private _readAlbum(): void {
    this._albumService.loadAlbum(this.routerID)
      .pipe(takeUntil(this._destroyed$))
      .subscribe((x: any) => {
      this.objAlbum = new Album();
      this.photos = [];

      this._zone.run(() => {
        this.objAlbum.initex(x);
      });

      if (this.objAlbum.accessCodeRequired) {
        // Show the dialog
        this._openAccessCodeDialog(this.objAlbum).subscribe((result: any) => {
          if (result) {
            this.objAlbum.AccessCode = result;
            this._loadPhotoIntoPage(0);
          }
        });
      } else if (!this.objAlbum.AccessCode) {
        this.objAlbum.AccessCode = undefined;
        this._loadPhotoIntoPage(0);
      }
    }, (error: HttpErrorResponse) => {
      // Show error info
      this._snackBar.open('Error occurred:' + error.message, undefined, {
        duration: 3000,
      });
    }, () => {
    });
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._photoService.loadAlbumPhoto(this.objAlbum.Id, this.objAlbum.AccessCode, this.pageSize, skipamt)
      .pipe(takeUntil(this._destroyed$))
      .subscribe((data: any) => {
      this.photoAmount = data.totalCount;
      this.photos = [];
      if (data && data.contentList && data.contentList instanceof Array) {
        for (const ce of data.contentList) {
          const pi: Photo = new Photo();
          pi.init(ce);
          this.photos.push(pi);
        }
      }
    }, (error: HttpErrorResponse) => {
      // Show error via snackbar
      this._snackBar.open('Error occurred ' + error.message, undefined, {
        duration: 3000,
      });
    });
  }
}

@Component({
  selector: 'album-accesscode-dialog',
  templateUrl: './album.accesscode.dialog.html',
})
export class AlbumAccessCodeDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}

@Component({
  selector: 'album-photoexif-dialog',
  templateUrl: './album.photoexif.dialog.html',
})
export class AlbumPhotoEXIFDialog {
  public currentPhoto: any;

  constructor(public _dialogRef: MatDialogRef<AlbumPhotoEXIFDialog>,
    public _uistatus: UIStatusService) {
    this.currentPhoto = this._uistatus.selPhotoInAblum;
  }
}
