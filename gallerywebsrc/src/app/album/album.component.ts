import {
  Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  EventEmitter, Input, Output, ViewContainerRef
} from '@angular/core';
import { UIMode } from '../model/common';
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
import { MdDialog, MdDialogRef } from '@angular/material';

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

  constructor(private _http: Http,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _albumService: AlbumService,
    private _photoService: PhotoService,
    private _uistatus: UIStatusService,
    public _dialog: MdDialog) { 
    this.objAlbum = new Album();
  }

  ngOnInit() {
    if (environment.DebugLogging) {
      console.log("Entering ngOnInit of AlbumComponent");
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === "create") {
          this.currentMode = "Create";
          this.objAlbum = new Album();
          this.uiMode = UIMode.Create;
        } else if (x[0].path === "edit") {
          this.routerID = +x[1].path;

          this.currentMode = "Edit"
          this.uiMode = UIMode.Change;
        } else if (x[0].path === "display") {
          this.routerID = +x[1].path;

          this.currentMode = "Display";
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

  private openAccessCodeDialog(): void {
    let dialogRef = this._dialog.open(AlbumAccessCodeDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.objAlbum.AccessCode = result;
      }
    });
  }

  private onViewPhotoEXIFDialog(selphoto: any): void {
    this.selectedPhoto = selphoto;
    
    let dialogRef = this._dialog.open(AlbumPhotoEXIFDialog, {
      height: '400px',
      width: '600px',
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

      if (this.objAlbum.AccessCode === "1") {
        // Show the dialog
        this.openAccessCodeDialog();
      }

      this._photoService.loadAlbumPhoto(this.routerID, this.objAlbum.AccessCode).subscribe(x2 => {
        this.photos = x2.contentList;
      }, error => {
      }, () => {
      });
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
  constructor(public dialogRef: MdDialogRef<AlbumPhotoEXIFDialog>) {    
  }
}
