import * as Common from './common';

/**
 * Album
 */
export class Album {
  public Id = 0;
  public Title = '';
  public Desp = '';
  public Thumbnail = '';
  public CreatedAt: Date = new Date();
  public CreatedBy = '';
  public IsPublic: boolean;
  public AccessCode = '';
  public accessCodeHint = '';
  public accessCodeRequired = false;

  // Runtime info
  public PhotoIDs: string[] = [];
  public PhotoCount = 0;
  public IsPhotoIDFetched: boolean;
  public AlbumThumnailUrl = '';

  constructor() {
    this.IsPhotoIDFetched = false;
    this.IsPublic = true;
  }

  // get ThumbnailInAPIUrl(): string {
  //   if (this.Thumbnail) {
  //     return environment.PhotoFileAPIUrl + '/' + this.Thumbnail;
  //   } else {
  //     return '/assets/img/grey.jpg';
  //   }
  // }

  get isValid(): boolean {
    if (this.Title === undefined || this.Title.length <= 0) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (data && data.PhotoCount) {
      this.PhotoCount = data.PhotoCount;
    }
    if (data && data.AlbumThumnailUrl) {
      this.AlbumThumnailUrl = data.AlbumThumnailUrl;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public writeJSONObject(): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const forJSON: any = {
      Title: this.Title,
      Desp: this.Desp,
      CreatedBy: this.CreatedBy,
      IsPublic: this.IsPublic,
    };
    if (this.CreatedAt) {
      forJSON.CreatedAt = this.CreatedAt.toISOString().slice(0, 10);
    }
    if (this.Id) {
      forJSON.Id = this.Id;
    }
    return forJSON;
  }
  public writeJSONString(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const forJSON: any = this.writeJSONObject();
    if (forJSON) {
      return JSON && JSON.stringify(forJSON);
    }
    return JSON && JSON.stringify(this);
  }
}

export class SelectableAlbum extends Album implements Common.SelectableObject<boolean> {
  public isSelected = false;
}

export class AlbumPhotoLink {
  albumID = 0;
  photoID = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parseData(data: any): void {
    if (data && data.AlbumID) {
      this.albumID = data.AlbumID;
    }
    if (data && data.PhotoID) {
      this.photoID = data.PhotoID;
    }
  }
  public writeJSONString(): string {
    const forJSON = {
      AlbumID: this.albumID,
      PhotoID: this.photoID,
    };
    if (forJSON) {
      return JSON && JSON.stringify(forJSON);
    }
    return JSON && JSON.stringify(this);
  }
}

export class AlbumPhotoByAlbum {
  public albumId = 0;
  public photoIDList: string[] = [];
}

export class AlbumPhotoByPhoto {
  public photoID = '';
  public albumIDList: number[] = [];
}
