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

  parseData(data: any) {
    if (data && data.Id) {
      this.Id = data.Id;
    }
    if (data && data.Title) {
      this.Title = data.Title;
    }
    if (data && data.Desp) {
      this.Desp = data.Desp;
    }
    if (data && data.CreatedAt) {
      this.CreatedAt = new Date(data.CreatedAt);
    }
    if (data && data.CreatedBy) {
      this.CreatedBy = data.CreatedBy;
    }
    if (data && data.IsPublic) {
      this.IsPublic = true;
    } else {
      this.IsPublic = false;
    }
    if (data && data.AccessCodeHint) {
      this.accessCodeHint = data.AccessCodeHint;
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
