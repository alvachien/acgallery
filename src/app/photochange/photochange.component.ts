import { Component, NgZone, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable, forkJoin, ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { UIMode, LogLevel, Photo, Album } from '../model';
import { AuthService, AlbumService, PhotoService, UIStatusService } from '../services';
import { environment } from '../../environments/environment';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-photochange',
  templateUrl: './photochange.component.html',
  styleUrls: ['./photochange.component.css'],
})
export class PhotochangeComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public currentPhoto: Photo;
  public currentMode: string;
  private uiMode: UIMode;

  displayedAssignedAlbumColumns = ['select', 'id', 'thumbnail', 'title'];
  dataSourceAssignedAlbum = new MatTableDataSource<Album>([]);
  displayedAvailableAlbumColumns = ['select', 'id', 'thumbnail', 'title'];
  dataSourceAvailableAlbum = new MatTableDataSource<Album>([]);
  selectionAssignedAlbum = new SelectionModel<Album>(true, []);
  selectionAvailableAlbum = new SelectionModel<Album>(true, []);
  // Enter, comma
  separatorKeysCodes: any[] = [ENTER, COMMA];

  isAllAssignedAlbumSelected() {
    const numSelected = this.selectionAssignedAlbum.selected.length;
    const numRows = this.dataSourceAssignedAlbum.data.length;
    return numSelected === numRows;
  }

  masterAssignedAlbumToggle() {
    this.isAllAssignedAlbumSelected() ?
        this.selectionAssignedAlbum.clear() :
        this.dataSourceAssignedAlbum.data.forEach((row: any) => this.selectionAssignedAlbum.select(row));
  }

  isAllAvailableAlbumSelected() {
    const numSelected = this.selectionAvailableAlbum.selected.length;
    const numRows = this.dataSourceAvailableAlbum.data.length;
    return numSelected === numRows;
  }

  masterAvailableAlbumToggle() {
    this.isAllAvailableAlbumSelected() ?
        this.selectionAvailableAlbum.clear() :
        this.dataSourceAvailableAlbum.data.forEach((row: any) => this.selectionAvailableAlbum.select(row));
  }

  constructor(private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private _authService: AuthService,
    private _photoService: PhotoService,
    private _albumService: AlbumService,
    private _uistatusService: UIStatusService,
    private _snackBar: MatSnackBar,
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor in PhotochangeComponent.');
    }
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering ngOnInit in PhotochangeComponent.');
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe((x: any) => {
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
      const allAlbum: Album[] = [];
      const assignedAlbum: Album[] = [];
      const unassignedAlbum: Album[] = [];

      forkJoin([s1, s2]).subscribe((y: any) => {
        if (y[0]) {
          for (const alb of y[0].contentList) {
            const album = new Album();
            album.initex(alb);

            allAlbum.push(album);
          }
        }

        if (y[1]) {
          for (const alb of allAlbum) {
            let bassign = false;
            for (const lk of y[1].contentList) {
              const alb2: Album = new Album();
              alb2.initex(lk);

              if (+alb.Id === +alb2.Id) {
                bassign = true;
                assignedAlbum.push(alb);
              }
            }
            if (!bassign) {
              unassignedAlbum.push(alb);
            }
          }
        } else {
          for (const alb of allAlbum) {
            unassignedAlbum.push(alb);
          }
        }

        this.dataSourceAssignedAlbum.data = assignedAlbum;
        this.dataSourceAvailableAlbum.data = unassignedAlbum;
      });
    }, (error: any) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error('ACGallery [Error]: Failed ot parse activateRoute of ngOnInit in PhotochangeComponent.');
      }
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

  public addItemTag($event: MatChipInputEvent): void {
    let input: any = $event.input;
    let value: any = $event.value;

    // Add new Tag
    if ((value || '').trim()) {
      this.currentPhoto.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeItemTag(tag: any): void {
    let index: number = this.currentPhoto.tags.indexOf(tag);

    if (index >= 0) {
      this.currentPhoto.tags.splice(index, 1);
    }
  }

  public onAddAssignedAlbum(): void {
    const agnalbum: Album[] = this.dataSourceAssignedAlbum.data;
    const avlalbum: Album[] = this.dataSourceAvailableAlbum.data;

    if (this.selectionAvailableAlbum.selected.length > 0) {
      this.selectionAvailableAlbum.selected.forEach((val: Album) => {
        const idx = avlalbum.findIndex((val2: Album, index: number) => {
          return val2.Id === val.Id;
        });
        if (idx !== -1) {
          avlalbum.splice(idx, 1);
        }

        agnalbum.push(val);
      });

      this.selectionAvailableAlbum.clear();
      this.dataSourceAssignedAlbum.data = agnalbum;
      this.dataSourceAvailableAlbum.data = avlalbum;
    }
  }

  public onRemoveAssignedAlbum(): void {
    const agnalbum: Album[] = this.dataSourceAssignedAlbum.data;
    const avlalbum: Album[] = this.dataSourceAvailableAlbum.data;

    if (this.selectionAssignedAlbum.selected.length > 0) {
      this.selectionAssignedAlbum.selected.forEach((val: Album) => {
        const idx = agnalbum.findIndex((val2: Album, index: number) => {
          return val2.Id === val.Id;
        });
        if (idx !== -1) {
          agnalbum.splice(idx, 1);
        }

        avlalbum.push(val);
      });

      this.selectionAssignedAlbum.clear();

      this.dataSourceAssignedAlbum.data = agnalbum;
      this.dataSourceAvailableAlbum.data = avlalbum;
    }
  }

  public onSubmit(): void {
    if (!this.isFieldChangable()) {
      return;
    }

    switch (this.uiMode) {
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

  private onSaveCreation(): void {
    // Will never happen
  }

  private onSaveChange(): void {
    this._photoService.updatePhoto(this.currentPhoto).subscribe((x: any) => {
      // Just ensure the request has been sent
      this._snackBar.open('Photo changed!', 'Close', {
        duration: 3000,
      }).afterDismissed().subscribe((y: any) => {
        // Jump to Photos page
        this._router.navigate(['/photo']);
      });
    }, (error: any) => {
      console.error(error);
    });
  }
}
