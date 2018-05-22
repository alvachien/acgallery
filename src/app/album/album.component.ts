import { Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  EventEmitter, Input, Output, ViewContainerRef
} from '@angular/core';
import { UIMode, LogLevel, Album, Photo, } from '../model';
import { AuthService, PhotoService, AlbumService, UIStatusService } from '../services';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, Subject, forkJoin, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogConfig, MatSnackBar, PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http/';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit, OnDestroy {
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
  private _watcherMedia: Subscription;
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
    this.objAlbum = new Album();
    this.photoAmount = 0;
    this.clnGridCount = 3; // Default

    this._watcherMedia = this._media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of AlbumComponent: ${this.activeMediaQuery}`);
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
      console.log('AC Gallery [Debug]: Entering ngOnInit of AlbumComponent');
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
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
    }, error => {
    }, () => {
      // Completed
    });
  }

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();
  }

  get isFieldChangable(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }

  private onPhotoClick(idx: number): void {
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
    const options = {
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: idx2 // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe(this._uistatus.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  private openAccessCodeDialog(): Observable<any> {
    const dialogRef = this._dialog.open(AlbumAccessCodeDialog);
    return dialogRef.afterClosed();
  }

  private onViewPhotoEXIFDialog(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;

    const dialogRef = this._dialog.open(AlbumPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe(result => {
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
      console.log('AC Gallery [Debug]: Entering onPageEvent of AlbumComponent');
    }

    this.pageEvent = $event;
    this.pageSize = this.pageEvent.pageSize;
    const skipamt = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  private _readAlbum(): void {
    this._albumService.loadAlbum(this.routerID).subscribe(x => {
      this.objAlbum = new Album();
      this.photos = [];

      this._zone.run(() => {
        this.objAlbum.init(x.id,
          x.title,
          x.desp,
          x.thumnail,
          x.dateCreated,
          x.createdby,
          x.isPublic,
          x.accessCode,
          x.photocnt);
      });

      if (this.objAlbum.AccessCode && this.objAlbum.AccessCode === '1') {
        // Show the dialog
        this.openAccessCodeDialog().subscribe(result => {
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
      this._snackBar.open('Error occurred:' + error.message);
    }, () => {
    });
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._photoService.loadAlbumPhoto(this.objAlbum.Id, this.objAlbum.AccessCode, this.pageSize, skipamt).subscribe((data: any) => {
      this.photoAmount = data.totalCount;
      this.photos = [];
      if (data && data.contentList && data.contentList instanceof Array) {
        for (const ce of data.contentList) {
          const pi: Photo = new Photo();
          pi.init(ce);
          this.photos.push(pi);
        }
      }
    });
  }
}

@Component({
  selector: 'album-accesscode-dialog',
  templateUrl: './album.accesscode.dialog.html',
})
export class AlbumAccessCodeDialog {
  constructor(public dialogRef: MatDialogRef<AlbumAccessCodeDialog>) {
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
