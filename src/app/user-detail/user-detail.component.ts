import { Component, OnInit } from '@angular/core';
import { AuthService, PhotoService, AlbumService } from '../services';
import { LogLevel, Photo, UpdPhoto, UserAuthInfo } from '../model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'acgallery-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {

  userName: string;
  canPhotoUpload: boolean;
  photoFileSize: string;
  canAlbumCreate: boolean;
  canAlbumChange: boolean;
  canAlbumDelete: boolean;
  canPhotoChange: boolean;
  canPhotoDelete: boolean;

  constructor(private _authService: AuthService,
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotoUploadComponent.');
    }

    this._authService.authContent.subscribe((x: UserAuthInfo) => {
      this.canAlbumCreate = x.canCreateAlbum();
      this.canAlbumChange = x.canChangeAlbum();
      this.canAlbumDelete = x.canDeleteAlbum();
      this.canPhotoChange = x.canChangePhoto();
      this.canPhotoDelete = x.canDeletePhoto();

      this.userName = x.getUserName();
      if (x.canUploadPhoto()) {
        this.canPhotoUpload = true;
        const sizes = x.getUserUploadKBSize();
        this.photoFileSize = sizes.join(' ~ ');
      } else {
        this.canPhotoUpload = false;
        this.photoFileSize = '';
      }
    });
   }

  ngOnInit() {
  }
}
