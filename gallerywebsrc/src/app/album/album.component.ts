import {
  Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  EventEmitter, Input, Output, ViewContainerRef
} from '@angular/core';
import { UIMode, LogLevel } from '../model/common';
import { Album } from '../model/album';
import { Photo } from '../model/photo';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
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

  constructor(private _http: Http,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _uistatus: UIStatusService,
    private _viewContainerRef: ViewContainerRef,
    public _dialog: MdDialog) { 
    this.objAlbum = new Album();
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("Entering ngOnInit of AlbumComponent");
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
      // this._dialogService.openAlert({
      //   message: error,
      //   disableClose: false, // defaults to false
      //   viewContainerRef: this._viewContainerRef, //OPTIONAL
      //   title: "Error", //OPTIONAL, hides if not provided
      //   closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
      // });
    }, () => {
      // Completed
    });
  }

  public needShowAccessCode(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }

  private onPhotoClick(): void {
    let items = [];
    for(let pht of this.photos) {
      items.push({
        src: pht.fileUrl,
        w: pht.width,
        h: pht.height
      });
    }

    // define options (if needed)
    var options = {
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: 0 // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe( this._uistatus.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  private openAccessCodeDialog(): Observable<any> {
    let dialogRef = this._dialog.open(AlbumAccessCodeDialog, {
      width: "400",
      height: "300",
      position: {
        top: "200",
        left: "100"
      }
    });
    return dialogRef.afterClosed();
  }

  private onViewPhotoEXIFDialog(selphoto: any): void {
    this._uistatus.selPhotoInAblum = selphoto;
    
    let dialogRef = this._dialog.open(AlbumPhotoEXIFDialog, {
      width: "400",
      height: "300",
      position: {
        top: "200",
        left: "100"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Do nothing.
    });
  }

  private onChangePhotoAssign(selphoto: any): void {

  }

  private readAlbum(): void {
    this._albumService.loadAlbum(this.routerID).subscribe(x => {
      this._zone.run(() => {
        this.objAlbum = new Album();
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
              
            }, () => {
            });
          }
        });
      } else if (!this.objAlbum.AccessCode) {
          this._photoService.loadAlbumPhoto(this.routerID, this.objAlbum.AccessCode).subscribe(x2 => {
            this.photos = x2.contentList;
          }, error => {
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
  constructor(public dialogRef: MdDialogRef<AlbumAccessCodeDialog>) {    
  }
}

@Component({
  selector: 'album-photoexif-dialog',
  templateUrl: './album.photoexif.dialog.html',
})
export class AlbumPhotoEXIFDialog {
  public currentPhoto: any;

  constructor(public _dialogRef: MdDialogRef<AlbumPhotoEXIFDialog>,
    public _uistatus: UIStatusService) {    
      this.currentPhoto = this._uistatus.selPhotoInAblum;
  }
}
