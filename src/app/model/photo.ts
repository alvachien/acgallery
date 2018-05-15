import * as Common from './common';
import { environment } from '../../environments/environment';

export class PhotoExif {
  public group: number;
  public name: string;
  public value: string;
}

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
  public exifTags: Array<PhotoExif>;

  constructor() {
  }

  get fileInAPIUrl(): string {
    return environment.PublicPhotoInAPIBaseUrl + '/' + this.fileUrl;
  }
  get thumbnailFileInAPIUrl(): string {
    return environment.PublicPhotoInAPIBaseUrl + '/' + this.thumbnailFileUrl;
  }

  init(data: any) {
    if (data && data.photoId) {
      this.photoId = data.photoId;
    }
    if (data && data.title) {
      this.title = data.title;
    }
    if (data && data.desp) {
      this.desp = data.desp;
    }
    if (data && data.width) {
      this.width = data.width;
    }
    if (data && data.height) {
      this.height = data.height;
    }
    if (data && data.fileUrl) {
      this.fileUrl = data.fileUrl;
    }
    if (data && data.thumbWidth) {
      this.thumbWidth = data.thumbWidth;
    }
    if (data && data.thumbHeight) {
      this.thumbHeight = data.thumbHeight;
    }
    if (data && data.thumbnailFileUrl) {
      this.thumbnailFileUrl = data.thumbnailFileUrl;
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
    if (data && data.orgFileName) {
      this.orgFileName = data.orgFileName;
    }
    if (data && data.isPublic) {
      this.isPublic = data.isPublic;
    } else {
      this.isPublic = false;
    }
    if (data && data.exifTags && data.exifTags instanceof Array) {
      this.exifTags = [];
      for(let tag of data.exifTags) {
        this.exifTags.push(tag);
      }
    }
  }
}

export class SelectablePhoto
  extends Photo
  implements Common.SelectableObject<Boolean> {
  public isSelected: boolean;
}

export class UpdPhoto {
  public imgSrc: string;

  public ID: number;
  public OrgName: string;
  public Name: string;
  public Width: number;
  public Height: number;
  public Size: string;

  public Title: string;
  public Desp: string;
  public IsPublic: boolean;

  public IsValid: boolean;
  public ValidInfo: string;
  get Dimension(): string {
    return this.Width.toString() + ' X ' + this.Height.toString();
  }

  constructor() {
    this.IsPublic = true;
  }
}
