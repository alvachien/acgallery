import * as Common from './common';
import { environment } from '../../environments/environment';

/**
 * Album
 */
export class Album {
  public Id: number;
  public Title: string;
  public Desp: string;
  public Thumbnail: string;
  public CreatedAt: Date;
  public CreatedBy: string;
  public IsPublic: boolean;
  public AccessCode: string;
  public accessCodeHint: string;
  public accessCodeRequired: boolean;

  // Runtime info
  public PhotoIDs: string[];
  public PhotoCount: number;
  public IsPhotoIDFetched: boolean;

  constructor() {
    this.IsPhotoIDFetched = false;
    this.IsPublic = true;
  }

  get ThumbnailInAPIUrl(): string {
    if (this.Thumbnail) {
      return environment.PhotoFileAPIUrl + '/' + this.Thumbnail;
    } else {
      return '/assets/img/grey.jpg';
    }
  }

  get isValid(): boolean {
    if (this.Title === undefined
      || this.Title.length <= 0) {
      return false;
    }
    return true;
  }

  initex(data: any) {
    if (data && data.id) {
      this.Id = data.id;
    }
    if (data && data.title) {
      this.Title = data.title;
    }
    if (data && data.desp) {
      this.Desp = data.desp;
    }
    if (data && data.firstPhotoThumnailUrl) {
      this.Thumbnail = data.firstPhotoThumnailUrl;
    }
    if (data && data.createdAt) {
      this.CreatedAt = data.createdAt;
    }
    if (data && data.createdBy) {
      this.CreatedBy = data.createdBy;
    }
    if (data && data.isPublic) {
      this.IsPublic = data.isPublic;
    } else {
      this.IsPublic = false;
    }
    if (data && data.accessCodeHint) {
      this.accessCodeHint = data.accessCodeHint;
    }
    if (data && data.accessCode) {
      this.AccessCode = data.accessCode;
    }
    if (data && data.accessCodeRequired) {
      this.accessCodeRequired = data.accessCodeRequired;
    }
    if (data && data.photoCount) {
      this.PhotoCount = data.photoCount;
    }
  }

  setPhotoID(photos: string[]) {
    this.PhotoIDs = photos;
    this.IsPhotoIDFetched = true;
  }

  resetPhotoID() {
    this.PhotoIDs = [];
    this.IsPhotoIDFetched = false;
  }
}

export class SelectableAlbum
  extends Album
  implements Common.SelectableObject<Boolean> {
  public isSelected: boolean;
}

export class AlbumPhotoLink {
  albumID: number;
  photoID: string;
}

export class AlbumPhotoByAlbum {
  public albumId: number;
  public photoIDList: string[];
}

export class AlbumPhotoByPhoto {
  public photoID: string;
  public albumIDList: number[];
}
