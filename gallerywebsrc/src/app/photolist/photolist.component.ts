import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';

import { Album, AlbumPhotoByAlbum } from '../model/album';
import { Photo, UpdPhoto } from '../model/photo';
import { LogLevel } from '../model/common';
import { environment } from '../../environments/environment';
import { MdSnackBar } from '@angular/material';
import { UIPagination } from '../model/paginated';
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
  private objUtil: UIPagination = null;
  private gallery: any = null;

  constructor(private _zone: NgZone,
    private _router: Router,
    private _route: ActivatedRoute,
    private _viewContainerRef: ViewContainerRef,
    private _uistatusService: UIStatusService,
    private _photoService: PhotoService,
    private _authService: AuthService,
    private _dialog: MdDialog) {
    this.objUtil = new UIPagination(15, 5);
  }

  ngOnInit() {
    this._photoService.loadPhotos().subscribe(x => {
      this.photos = x.contentList;
      let count = x.totalCount;
    }, error => {
    }, () => {
    });
  }  

  onPhotoClick(): void {
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
    this.gallery = new PhotoSwipe( this._uistatusService.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  onViewPhotoEXIFDialog(photo: any): void {
    this._uistatusService.selPhotoInPhotoList = photo;

    let dialogRef = this._dialog.open(PhotoListPhotoEXIFDialog, {
      width: "300",
      position: {
        top: "100",
        left: "100"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Do nothing.
    });
  }
}

@Component({
  selector: 'photolist-photoexif-dialog',
  templateUrl: './photolist.photoexif.dialog.html',
})
export class PhotoListPhotoEXIFDialog {
  public currentPhoto: any;

  constructor(public _dialogRef: MdDialogRef<PhotoListPhotoEXIFDialog>,
    public _uistatus: UIStatusService) {    
      this.currentPhoto = this._uistatus.selPhotoInPhotoList;
  }
}
