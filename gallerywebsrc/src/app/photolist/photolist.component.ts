import { Component, NgZone, OnInit } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'acgallery-photolist',
  templateUrl: './photolist.component.html',
  styleUrls: ['./photolist.component.css']
})
export class PhotolistComponent implements OnInit {
  public photos: Photo[] = [];
  public selectedPhoto: Photo = null;
  private objUtil: UIPagination = null;

  constructor(private _zone: NgZone,
    private _router: Router,
    private _route: ActivatedRoute,
    private _uistatusService: UIStatusService,
    private _photoService: PhotoService,
    private _authService: AuthService) {
    this.objUtil = new UIPagination(15, 5);
  }

  ngOnInit() {
  }  
}
