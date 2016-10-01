import * as Common from './common';

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
    public thumbwidth: number;
    public thumbheight: number;

    public thumbnailFileUrl: string;
    public fileFormat: string;
    public uploadedBy: string;
    public uploadedTime: Date;
    public orgFileName: string;
    public isPublic: boolean;
    public exifTags: Array<PhotoExif>

    constructor() {
    }
}

export class SelectablePhoto
    extends Photo
    implements Common.SelectableObject<Boolean> {
    public isSelected: boolean;
}

export class UpdPhoto {
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
        return this.Width.toString() + " X " + this.Height.toString();
    }
}

