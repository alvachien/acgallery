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
  public assignedAlbum: SelectableAlbum[];
  public unassignedAlbum: SelectableAlbum[];
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
    this.assignedAlbum = [];
    this.unassignedAlbum = [];
  }

  ngOnInit() {
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
      } else if (this._uistatusService.selPhotoInPhotoList) {
        this.currentPhoto = this._uistatusService.selPhotoInPhotoList;
      }

      if (!this.currentPhoto) {
        this._router.navigate(['/pagenotfound']);
        return;
      }

      let s1 = this._albumService.loadAlbums();
      let s2 = this._albumService.loadAlbumContainsPhoto(this.currentPhoto.photoId);
      let allAlbum: any[] = [];

      Observable.forkJoin([s1, s2]).subscribe(x => {
        if (x[0]) {
          for (let alb of x[0].contentList) {
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

            allAlbum.push(album);
          }
        }

        if (x[1] ) {
          for (let alb of allAlbum) {
            let bassign: boolean = false;
            for (let lk of x[1].contentList) {
              let alb2: SelectableAlbum = new SelectableAlbum();
              alb2.initex(lk);

              if (+alb.Id === +alb2.Id) {
                bassign = true;
                this.assignedAlbum.push(alb);
              }
            }
            if (!bassign) {
              this.unassignedAlbum.push(alb);
            }
          }
        } else {
          for (let alb of allAlbum) {
            this.unassignedAlbum.push(alb);
          }
        }
      });
    }, error => {
    }, () => {
      // Completed
    });
  }

  ngOnDestroy() {
    if (this._uistatusService.selPhotoInAblum) {
      this._uistatusService.selPhotoInAblum = null;
    } else if (this._uistatusService.selPhotoInPhotoList) {
      this._uistatusService.selPhotoInPhotoList = null;
    }
  }

  public onAddAssignedAlbum(): void {
    this.onSwitchArray(this.unassignedAlbum, this.assignedAlbum);
  }

  public onRemoveAssignedAlbum() : void {
    this.onSwitchArray(this.assignedAlbum, this.unassignedAlbum);
  }

  private onSwitchArray(ar1: SelectableAlbum[], ar2: SelectableAlbum[]) {
    let arpos: number[] = [];
    for(let i = 0; i < ar1.length; i ++) {
      if (ar1[i].isSelected) {
        arpos.push(i);
      }
    }

    arpos.sort((a, b) => { return b - a; });

    for(let i of arpos) {
      ar2.push(ar1[i]);
      ar1.splice(i);
    }   
  }
}
