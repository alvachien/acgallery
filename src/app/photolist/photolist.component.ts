import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';

import { Album, AlbumPhotoByAlbum } from '../model/album';
import { Photo, UpdPhoto } from '../model/photo';
import { LogLevel } from '../model/common';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';
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
    private _dialog: MatDialog) {
    this.objUtil = new UIPagination(20, 5);
  }

  ngOnInit() {
    this.onPageClick(1);
  }

  onPhotoClick(idx: number): void {
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
    var options = {
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
    this._uistatusService.selPhotoInPhotoList = photo;

    let dialogRef = this._dialog.open(PhotoListPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe(result => {
      this._uistatusService.selPhotoInPhotoList = null;
    });
  }

  public onDisplayPhoto(photo: any): void {
    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/display']);
  }

  public onChangePhoto(photo: any): void {
    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/edit']);
  }

  onPagePreviousClick(): void {
    if (this.objUtil.currentPage > 1) {
      this.onPageClick(this.objUtil.currentPage - 1);
    }
  }

  onPageNextClick(): void {
    this.onPageClick(this.objUtil.currentPage + 1);
  }

  onPageClick(pageIdx: number): void {
    if (this.objUtil.currentPage != pageIdx) {
      this.objUtil.currentPage = pageIdx;

      let paraString = this.objUtil.nextAPIString;
      this._photoService.loadPhotos(paraString).subscribe(data => {
        this.objUtil.totalCount = data.totalCount;
        this._zone.run(() => {
          this.photos = [];
          if (data && data.contentList && data.contentList instanceof Array) {
            this.photos = data.contentList;
          }
        });
      }, error => {
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
    this.currentPhoto = this._uistatus.selPhotoInPhotoList;
  }
}
