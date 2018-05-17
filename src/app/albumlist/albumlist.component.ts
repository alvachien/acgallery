import { Component, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent, MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { AlbumService } from '../services/album.service';
import { UIStatusService } from '../services/uistatus.service';
import { Album, AlbumPhotoByAlbum, Photo, UpdPhoto, LogLevel } from '../model';

@Component({
  selector: 'acgallery-albumlist',
  templateUrl: './albumlist.component.html',
  styleUrls: ['./albumlist.component.css']
})
export class AlbumlistComponent implements OnInit {

  public albumes: Album[] = [];
  public albumAmount: number;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private _authService: AuthService,
    private _albumService: AlbumService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _zone: NgZone,
    private _snackbar: MatSnackBar) {
    this.albumAmount = 0;
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Gallery [Debug]: Entering ngOnInit of AlbumListComponent');
    }

    this._loadPhotoIntoPage(0);
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

    const skipamt = this.pageEvent.pageIndex * this.pageSize;
    this._loadPhotoIntoPage(skipamt);
  }

  private _loadPhotoIntoPage(skipamt: number) {
    this._albumService.loadAlbums(this.pageSize, skipamt).subscribe(x => {
      this._zone.run(() => {
        this.albumes = [];
        this.albumAmount = x.totalCount;
        for (const alb of x.contentList) {
          const album = new Album();
          album.init(alb.id,
            alb.title,
            alb.desp,
            alb.firstPhotoThumnailUrl,
            alb.createdAt,
            alb.createdBy,
            alb.isPublic,
            alb.accessCode,
            alb.photoCount);

          this.albumes.push(album);
        }
      });
    }, error => {
    }, () => {
    });
  }
}
