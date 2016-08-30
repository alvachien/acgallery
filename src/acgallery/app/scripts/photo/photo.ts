export class PhotoExif {
    public group: number;
    public name: string;
    public value: string;
}

export class Photo {

    public photoId: string;

    public title: string;
    public desp: string;
    public fileUrl: string;

    public thumbnailFileUrl: string;
    public fileFormat: string;
    public uploadedBy: string;
    public uploadedTime: Date;
    public orgFileName: string;
    public exifTags: Array<PhotoExif>

    constructor() {
    }
}

export class SelectablePhoto extends Photo {
    public IsSelected: boolean;
}

