import { Component, NgZone, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { UIMode, LogLevel, Photo, Album, SelectableAlbum } from '../model';
import { AuthService, AlbumService, PhotoService, UIStatusService } from '../services';
import { environment } from '../../environments/environment';

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

  constructor(private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _photoService: PhotoService,
    private _albumService: AlbumService,
    private _uistatusService: UIStatusService,
    private _snackBar: MatSnackBar
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor in PhotochangeComponent.');
    }

    this.assignedAlbum = [];
    this.unassignedAlbum = [];
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit in PhotochangeComponent.');
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACGallery [Debug]: Entering activateRoute subscribe of ngOnInit in PhotochangeComponent.');
      }

      if (x instanceof Array && x.length > 0) {
        if (x[0].path === 'edit') {
          this.currentMode = 'Common.Edit';
          this.uiMode = UIMode.Change;
        } else if (x[0].path === 'display') {
          this.currentMode = 'Common.Display';
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

      const s1 = this._albumService.loadAlbums();
      const s2 = this._albumService.loadAlbumContainsPhoto(this.currentPhoto.photoId);
      const allAlbum: any[] = [];

      Observable.forkJoin([s1, s2]).subscribe(y => {
        if (y[0]) {
          for (const alb of y[0].contentList) {
            const album = new SelectableAlbum();
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

        if (y[1]) {
          for (const alb of allAlbum) {
            let bassign = false;
            for (const lk of y[1].contentList) {
              const alb2: SelectableAlbum = new SelectableAlbum();
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
          for (const alb of allAlbum) {
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

  public isFieldChangable(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }

  public onAddAssignedAlbum(): void {
    this.onSwitchArray(this.unassignedAlbum, this.assignedAlbum);
  }

  public onRemoveAssignedAlbum(): void {
    this.onSwitchArray(this.assignedAlbum, this.unassignedAlbum);
  }

  public onSubmit(): void {
    if (!this.isFieldChangable()) {
      return;
    }

    switch(this.uiMode) {
      case UIMode.Create: {
        this.onSaveCreation();
      }
      break;

      case UIMode.Change: {
        this.onSaveChange();
      }
      break;

      default:
      break;
    }
  }

  private onSwitchArray(ar1: SelectableAlbum[], ar2: SelectableAlbum[]) {
    const arpos: number[] = [];
    for (let i = 0; i < ar1.length; i ++) {
      if (ar1[i].isSelected) {
        arpos.push(i);
      }
    }

    arpos.sort((a, b) => { return b - a; });

    for (const i of arpos) {
      ar2.push(ar1[i]);
      ar1.splice(i);
    }
  }

  private onSaveCreation(): void {
    // Will never happen
  }

  private onSaveChange(): void {
    this._photoService.updatePhoto(this.currentPhoto).subscribe(x => {
      // Just ensure the request has been sent
      this._snackBar.open('Photo changed!', 'Close', {
        duration: 3000,
      }).afterDismissed().subscribe(y => {
        // Jump to Photos page
        this._router.navigate(['/photo']);            
      });
    }, error => {
      console.error(error);
    });
  }
}
