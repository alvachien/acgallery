import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent, MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';
import { Album, AlbumPhotoByAlbum, Photo, UpdPhoto, LogLevel } from '../model';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'acgallery-albumlist',
  templateUrl: './albumlist.component.html',
  styleUrls: ['./albumlist.component.css']
})
export class AlbumlistComponent implements OnInit, OnDestroy {

  public albumes: Album[] = [];
  public albumAmount: number;
  pageSize = 20;
  pageSizeOptions = [20, 40, 60, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  // Layout
  clnGridCount: number;
  private _watcherMedia: Subscription;
  activeMediaQuery = '';

  constructor(private _authService: AuthService,
    private _albumService: AlbumService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _zone: NgZone,
    private _uiStatus: UIStatusService,
    private _media: ObservableMedia,
    private _snackbar: MatSnackBar) {
    this.albumAmount = 0;
    this.clnGridCount = 3; // Default

    this._watcherMedia = this._media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of AlbumlistComponent: ${this.activeMediaQuery}`);
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
      console.log('AC Gallery [Debug]: Entering ngOnInit of AlbumListComponent');
    }

    this._loadPhotoIntoPage(0);
  }

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();
  }

  public onViewAlbumClick(id: number | string): void {
    this._router.navigate(['/album/display/' + id.toString()]);
  }

  public onChangeAlbumMetadata(id: number | string): void {
    this._router.navigate(['/album/edit/' + id.toString()]);
  }

  public onPageEvent($event: any) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Gallery [Debug]: Entering onPageEvent of AlbumListComponent');
    }

    this.pageEvent = $event;

    this.pageSize = this.pageEvent.pageSize;
    const skipamt = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._albumService.loadAlbums(this.pageSize, skipamt).subscribe(x => {
      this._zone.run(() => {
        this.albumes = [];
        this.albumAmount = x.totalCount;
        for (const alb of x.contentList) {
          const album = new Album();
          album.initex(alb);

          this.albumes.push(album);
        }
      });
    }, (error: any) => {
      // Do nothing
    }, () => {
    });
  }
}
