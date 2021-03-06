import * as Common from './common';
import { environment } from '../../environments/environment';
import { transCompatFormat } from 'ng-zorro-antd/date-picker';

/**
 * Exif item
 */
export class PhotoExif {
  public group: number;
  public name: string;
  public value: string;
}

export class TagCount {
  public tagString: string;
  public count: number;
}

/**
 * Photo
 */
export class Photo {

  public photoId: string;

  public title: string;
  public desp: string;
  public width: number;
  public height: number;
  public fileUrl: string;
  public thumbWidth: number;
  public thumbHeight: number;

  public thumbnailFileUrl: string;
  public fileFormat: string;
  public uploadedBy: string;
  public uploadedTime: Date;
  public orgFileName: string;
  public isPublic: boolean;

  public cameraMaker: string;
  public cameraModel: string;
  public lensModel: string;
  public avNumber: string;
  public shutterSpeed: string;
  public isoNumber: number;

  public exifTags: PhotoExif[];
  public rating: number;
  public tags: string[] = [];

  constructor() {
  }

  get fileInAPIUrl(): string {
    if (this.fileUrl) {
      return environment.PhotoFileAPIUrl + '/' + this.fileUrl;
    }
  }
  get thumbnailFileInAPIUrl(): string {
    if (this.thumbnailFileUrl) {
      return environment.PhotoFileAPIUrl + '/' + this.thumbnailFileUrl;
    }
  }

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
    if (data && data.tags && data.tags instanceof Array) {
      this.tags = [];
      for (const tg of data.tags) {
        this.tags.push(tg);
      }
    }
  }
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

export class SelectablePhoto
  extends Photo
  implements Common.SelectableObject<boolean> {
  public isSelected: boolean;
}

/**
 * Photo for upload
 */
export class UpdPhoto {
  public uid: string;
  public imgSrc: string;
  public thumbSrc: string;

  public id: number;
  public orgName: string;
  public name: string;
  public width: number;
  public height: number;
  public size: string;

  public title: string;
  public desp: string;
  public isPublic: boolean;

  // public isValid: boolean;
  public validInfo: string;
  get dimension(): string {
    return this.width.toString() + ' X ' + this.height.toString();
  }
  public tags: string[] = [];
  public rating: number;

  constructor() {
    this.isPublic = true;
  }
  get isValid(): boolean {
    if (!this.imgSrc) return false;
    if (!this.thumbSrc) return false;
    if (!this.title) return false;
    // if (!this.desp) return false;
    return true;
  }
}
