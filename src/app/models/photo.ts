import * as Common from './common';
import { environment } from '../../environments/environment';

/**
 * Exif item
 */
export class PhotoExif {
  public group = 0;
  public name = '';
  public value = '';
}

export class TagCount {
  public tagString = '';
  public count = 0;
}

/**
 * Photo
 */
export class Photo {
  public photoId = '';

  public title = '';
  public desp = '';
  public width = 0;
  public height = 0;
  public fileUrl = '';
  public thumbWidth = 0;
  public thumbHeight = 0;

  public thumbnailFileUrl = '';
  public fileFormat = '';
  public uploadedBy = '';
  public uploadedTime: Date = new Date();
  public orgFileName = '';
  public isPublic = false;

  public cameraMaker = '';
  public cameraModel = '';
  public lensModel = '';
  public avNumber = '';
  public shutterSpeed = '';
  public isoNumber = 0;

  public exifTags: PhotoExif[] = [];
  public rating = 0;
  public tags: string[] = [];

  // get fileInAPIUrl(): string {
  //   if (this.fileUrl) {
  //     return environment.PhotoFileAPIUrl + '/' + this.fileUrl;
  //   }
  // }
  // get thumbnailFileInAPIUrl(): string {
  //   if (this.thumbnailFileUrl) {
  //     return environment.PhotoFileAPIUrl + '/' + this.thumbnailFileUrl;
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseData(data: any) {
    if (data && data.PhotoId) {
      this.photoId = data.PhotoId;
    }
    if (data && data.Title) {
      this.title = data.Title;
    }
    if (data && data.Desp) {
      this.desp = data.Desp;
    }
    if (data && data.Width) {
      this.width = data.Width;
    }
    if (data && data.Height) {
      this.height = data.Height;
    }
    if (data && data.FileUrl) {
      this.fileUrl = data.FileUrl;
    }
    if (data && data.ThumbWidth) {
      this.thumbWidth = data.ThumbWidth;
    }
    if (data && data.ThumbHeight) {
      this.thumbHeight = data.ThumbHeight;
    }
    if (data && data.ThumbnailFileUrl) {
      this.thumbnailFileUrl = data.ThumbnailFileUrl;
    }
    if (data && data.fileFormat) {
      this.fileFormat = data.fileFormat;
    }
    if (data && data.uploadedBy) {
      this.uploadedBy = data.uploadedBy;
    }
    if (data && data.uploadedTime) {
      this.uploadedTime = data.uploadedTime;
    }
    if (data && data.OrgFileName) {
      this.orgFileName = data.OrgFileName;
    }
    if (data && data.IsPublic) {
      this.isPublic = data.IsPublic;
    } else {
      this.isPublic = false;
    }
    if (data && data.cameraMaker) {
      this.cameraMaker = data.cameraMaker;
    }
    if (data && data.cameraModel) {
      this.cameraModel = data.cameraModel;
    }
    if (data && data.lensModel) {
      this.lensModel = data.lensModel;
    }
    if (data && data.avNumber) {
      this.avNumber = data.avNumber;
    }
    if (data && data.shutterSpeed) {
      this.shutterSpeed = data.shutterSpeed;
    }
    if (data && data.isoNumber) {
      this.isoNumber = data.isoNumber;
    }
    if (data && data.exifTags && data.exifTags instanceof Array) {
      this.exifTags = [];
      for (const tag of data.exifTags) {
        this.exifTags.push(tag);
      }
    }
    if (data && data.rating) {
      this.rating = data.rating;
    }
    if (data && data.Tags && data.Tags instanceof Array) {
      this.tags = [];
      for (const tg of data.Tags) {
        this.tags.push(tg.TagString);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateJson(): any {
    return {
      PhotoId: this.photoId,
      Title: this.title,
      Desp: this.desp,
      Width: this.width,
      Height: this.height,
      FileUrl: this.fileUrl,
      ThumbnailFileUrl: this.thumbnailFileUrl,
      ThumbWidth: this.thumbWidth,
      ThumbHeight: this.thumbHeight,
      IsPublic: this.isPublic,
    };
  }
}

export class SelectablePhoto extends Photo implements Common.SelectableObject<boolean> {
  public isSelected = false;
}

/**
 * Photo for upload
 */
export class UpdPhoto {
  public uid = '';
  public imgFile = '';
  public thumbFile = '';
  public width = 0;
  public height = 0;
  public size = '';
  public thumbWidth = 0;
  public thumbHeight = 0;
  get imgSrc(): string {
    return `${environment.apiRootUrl}PhotoFile/${this.imgFile}`;
  }
  get thumbSrc(): string {
    return `${environment.apiRootUrl}PhotoFile/${this.thumbFile}`;
  }
  public title = '';
  public desp = '';
  public isPublic = false;
  public orgName = '';
  public name = '';

  public id = 0;
  public validInfo = '';
  get dimension(): string {
    return this.width.toString() + ' X ' + this.height.toString();
  }
  public tags: string[] = [];
  public rating = 0;

  constructor() {
    this.isPublic = true;
  }
  get isValid(): boolean {
    if (!this.imgFile) return false;
    if (!this.thumbFile) return false;
    if (!this.title) return false;
    // if (!this.desp) return false;
    return true;
  }
}
