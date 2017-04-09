import { Component, NgZone, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { UIMode } from '../model/common';
import { Photo } from '../model/photo';
import { Album, SelectableAlbum } from '../model/album';
import { AuthService } from '../services/auth.service';
import { AlbumService } from '../services/album.service';
import { PhotoService } from '../services/photo.service';
import { UIStatusService } from '../services/uistatus.service';

@Component({
  selector: 'app-photochange',
  templateUrl: './photochange.component.html',
  styleUrls: ['./photochange.component.css']
})
export class PhotochangeComponent implements OnInit, OnDestroy {
  public currentPhoto: Photo;
  public currentMode: string;
  public allAlbum: SelectableAlbum[];
  private uiMode: UIMode;

  constructor(private _http: Http,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _photoService: PhotoService,
    private _albumService: AlbumService,
    private _uistatusService: UIStatusService
  ) {
    this.allAlbum = []; 
  }

  ngOnInit() {
    this._albumService.loadAlbums().subscribe(x => {
      for (let alb of x.contentList) {
        let album = new SelectableAlbum();
        album.init(alb.id,
          alb.title,
          alb.desp,
          alb.firstPhotoThumnailUrl,
          alb.createdAt,
          alb.createdBy,
          alb.isPublic,
          alb.accessCode,
          alb.photoCount);
        if (!album.Thumbnail) {
          album.Thumbnail = '/assets/img/grey.jpg';
        }

        this.allAlbum.push(album);
      }
    });

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === "edit") {
          this.currentMode = "Common.Edit"
          this.uiMode = UIMode.Change;
        } else if (x[0].path === "display") {
          this.currentMode = "Common.Display";
          this.uiMode = UIMode.Display;
        }
      }

      if (this._uistatusService.selPhotoInAblum) {
        this.currentPhoto = this._uistatusService.selPhotoInAblum;
      } else if(this._uistatusService.selPhotoInPhotoList) {
        this.currentPhoto = this._uistatusService.selPhotoInPhotoList;
      } else {
        this._router.navigate(['/pagenotfound']);
      }
    }, error => {
    }, () => {
      // Completed
    });
  }

  ngOnDestroy() {
    if (this._uistatusService.selPhotoInAblum) {
      this._uistatusService.selPhotoInAblum = null;
    } else if(this._uistatusService.selPhotoInPhotoList) {
      this._uistatusService.selPhotoInPhotoList = null;
    }    
  }
}
