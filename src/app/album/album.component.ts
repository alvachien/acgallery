import {
  Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  EventEmitter, Input, Output, ViewContainerRef
} from '@angular/core';
import { UIMode, LogLevel } from '../model/common';
import { Album } from '../model/album';
import { Photo } from '../model/photo';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';
import { MatDialog, MatDialogRef, MatDialogConfig, MatSnackBar } from '@angular/material';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  public objAlbum: Album = null;
  public photos: Photo[] = [];
  public selectedPhoto: Photo;

  private uiMode: UIMode = UIMode.Display;
  private currentMode: string;
  private routerID: number;
  private gallery: any;

  constructor(
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _uistatus: UIStatusService,
    private _viewContainerRef: ViewContainerRef,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
    this.objAlbum = new Album();
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Gallery [Debug]: Entering ngOnInit of AlbumComponent");
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === "create") {
          this.currentMode = "Common.Create";
          this.objAlbum = new Album();
          this.uiMode = UIMode.Create;
        } else if (x[0].path === "edit") {
          this.routerID = +x[1].path;

          this.currentMode = "Common.Edit"
          this.uiMode = UIMode.Change;
        } else if (x[0].path === "display") {
          this.routerID = +x[1].path;

          this.currentMode = "Common.Display";
          this.uiMode = UIMode.Display;
        }
      }

      if (this.uiMode === UIMode.Display || this.uiMode === UIMode.Change) {
        // Load the album
        this.readAlbum();
      }
    }, error => {
    }, () => {
      // Completed
    });
  }

  public isFieldChangable(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }
  
  public needShowAccessCode(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }

  private onPhotoClick(idx: number): void {
    if (this.photos.length <= 0) {
      return;
    }

    let items = [];
    for (let pht of this.photos) {
      items.push({
        src: pht.fileUrl,
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
    let options = {
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
    let dialogRef = this._dialog.open(AlbumAccessCodeDialog);
    return dialogRef.afterClosed();
  }

  private onViewPhotoEXIFDialog(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;

    let dialogRef = this._dialog.open(AlbumPhotoEXIFDialog);
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

  private readAlbum(): void {
    this._albumService.loadAlbum(this.routerID).subscribe(x => {
      this.objAlbum = new Album();
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

      if (this.objAlbum.AccessCode && this.objAlbum.AccessCode === "1") {
        // Show the dialog
        this.openAccessCodeDialog().subscribe(result => {
          if (result) {
            this.objAlbum.AccessCode = result;
            this._photoService.loadAlbumPhoto(this.routerID, this.objAlbum.AccessCode).subscribe(x2 => {
              this.photos = x2.contentList;
            }, error => {
              // Show error dialog
              this._snackBar.open("Error occurred: " + error);
            }, () => {
            });
          }
        });
      } else if (!this.objAlbum.AccessCode) {
        this._photoService.loadAlbumPhoto(this.routerID, this.objAlbum.AccessCode).subscribe(x2 => {
          this.photos = x2.contentList;
        }, error => {
          // Show error dialog
          this._snackBar.open("Error occurred: " + error);
        }, () => {
        });
      }
    }, error => {
    }, () => {
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
