import * as Common from './common';
import { environment } from '../../environments/environment';

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
}

export class SelectablePhoto
  extends Photo
  implements Common.SelectableObject<Boolean> {
  public isSelected: boolean;
}

/**
 * Photo for upload
 */
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
  public Tags: string[] = [];
  public Rating: number;

  constructor() {
    this.IsPublic = true;
  }
}
