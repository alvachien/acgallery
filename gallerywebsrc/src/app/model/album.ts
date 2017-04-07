import * as Common from './common';

export class Album {
    public Id: number;
    public Title: string;
    public Desp: string;
    public Thumbnail: string;
    public CreatedAt: Date;
    public CreatedBy: string;
    public IsPubic: boolean;
    public AccessCode: string;

    // Runtime info
    public PhotoIDs: string[];
    public PhotoCount: number;
    public IsPhotoIDFetched: boolean;

    constructor() {
        this.IsPhotoIDFetched = false;
        this.IsPubic = true;
    }

    init(id: number,
        title: string,
        desp: string,
        thumnail: string,
        dateCreated: Date,
        createdby: string,
        isPublic: boolean,
        accessCode: string,
        photocnt: number) {
        this.Id = id;
        this.Title = title;
        this.Desp = desp;
        this.Thumbnail = thumnail;
        this.CreatedAt = dateCreated;
        this.CreatedBy = createdby;

        this.IsPubic = isPublic;
        this.AccessCode = accessCode;

        this.PhotoCount = photocnt;
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
    implements Common.SelectableObject<Boolean>
{
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
