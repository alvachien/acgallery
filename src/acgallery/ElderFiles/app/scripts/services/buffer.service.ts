import { Injectable } from '@angular/core';
import { Album, AlbumPhotoLink } from '../model/album';
import { Photo } from '../model/photo';

@Injectable()
export class BufferService {
    albums: Array<Album>;
    photos: Array<Photo>;
    albumPhotoLinks: Array<AlbumPhotoLink>;
    private linkByAlbum: Array<number>;
    private linkByPhoto: Array<string>;
    private _isAlbumLoaded: boolean;
    private _isPhotoLoaded: boolean;

    constructor() {
        this._isAlbumLoaded = false;
        this._isPhotoLoaded = false;

        this.albums = new Array<Album>();
        this.photos = new Array<Photo>();
        this.albumPhotoLinks = new Array<AlbumPhotoLink>();

        this.linkByAlbum = new Array<number>();
        this.linkByPhoto = new Array<string>();
    }

    get albumListWithLink() : number[] {
        return this.linkByAlbum;
    }
    get photoListWithLink(): string[] {
        return this.linkByPhoto;
    }
    get isAlbumLoaded(): boolean {
        return this._isAlbumLoaded;
    }
    set isAlbumLoaded(val: boolean) {
        this._isAlbumLoaded = val;
    }
    setAlbums(data: Array<Album>) {
        this.albums = data;
        this._isAlbumLoaded = true;
    }
    resetAlbums() {
        this.albums = new Array<Album>();
        this._isAlbumLoaded = false;
    }

    get isPhotoLoaded(): boolean {
        return this._isPhotoLoaded;
    }
    set isPhotoLoaded(val: boolean) {
        this._isPhotoLoaded = val;
    }
    setPhotos(data: Array<Photo>) {
        this.photos = data;
        this._isPhotoLoaded = true;
    }
    resetPhotos() {
        this.photos = new Array<Photo>();
        this._isPhotoLoaded = false;
    }

    isAlbumLinkLoaded(albumid: number): boolean {
        return this.linkByAlbum.some((value, index, array) => {
            return value === +albumid;
        });
    }

    isPhotoLinkLoaded(photoid: string): boolean {
        return this.linkByPhoto.some((value, index, array) => {
            return value === photoid;
        });
    }

    getLinkInfo(albumid?: number, photoid?: string): AlbumPhotoLink[] {
        let retData: AlbumPhotoLink[];

        if (this.albumPhotoLinks.length <= 0 || (!albumid && !photoid))
            return [];

        this.albumPhotoLinks.every((value, index, array) => {
            if (albumid) {
                if (value.AlbumID === +albumid)
                    retData.push(value);
            } else {
                if (value.PhotoID === photoid)
                    retData.push(value);
            }    
            return true;        
        });

        return retData;
    }

    setLinkInfo(links: Array<AlbumPhotoLink>, albumid?: number, photoid?: string) {
        if (albumid) {
            let idx: number = this.linkByAlbum.indexOf(+albumid);
            if (idx === -1) {
                links.forEach((value, index, array) => {
                    let idx2: number = -1;
                    this.albumPhotoLinks.forEach((value2, index2, array2) => {
                        if (value.AlbumID === value2.AlbumID
                            && value.PhotoID === value2.PhotoID) {
                            idx2 = index2;
                        }
                    });

                    if (idx2 === -1) {
                        this.albumPhotoLinks.push(value);
                    } else {
                        // Do we really need this?
                        this.albumPhotoLinks[idx2] = value;
                    }
                });

                this.linkByAlbum.push(+albumid);
            } 
            else {
                // Remove the existing records for the specified album
                this.albumPhotoLinks.forEach((value, index, array) => {
                    if (value.AlbumID === albumid) {
                        this.albumPhotoLinks.splice(index, 1);
                    }
                });

                links.forEach((value, index, array) => {
                    let idx2: number = -1;
                    this.albumPhotoLinks.forEach((value2, index2, array2) => {
                        if (value.AlbumID === value2.AlbumID
                            && value.PhotoID === value2.PhotoID) {
                            idx2 = index2;
                        }
                    });

                    if (idx2 === -1) {
                        this.albumPhotoLinks.push(value);
                    } else {
                        // Do we really need this?
                        this.albumPhotoLinks[idx2] = value;
                    }
                });

                // Exists already, don't need a push then.
                //this.linkByAlbum.push(+albumid);
            }
        } else if (photoid) {
            let idx: number = this.linkByPhoto.indexOf(photoid);
            if (idx === -1) {
                links.forEach((value, index, array) => {
                    let idx2: number = -1;
                    this.albumPhotoLinks.forEach((value2, index2, array2) => {
                        if (value.AlbumID === value2.AlbumID
                            && value.PhotoID === value2.PhotoID) {
                            idx2 = index2;
                        }
                    });

                    if (idx2 === -1) {
                        this.albumPhotoLinks.push(value);
                    } else {
                        // Do we really need this?
                        this.albumPhotoLinks[idx2] = value;
                    }
                });

                this.linkByPhoto.push(photoid);
            }
            else {
                // Remove the existing records for the specified photo
                this.albumPhotoLinks.forEach((value, index, array) => {
                    if (value.PhotoID === photoid) {
                        this.albumPhotoLinks.splice(index, 1);
                    }
                });

                links.forEach((value, index, array) => {
                    let idx2: number = -1;
                    this.albumPhotoLinks.forEach((value2, index2, array2) => {
                        if (value.AlbumID === value2.AlbumID
                            && value.PhotoID === value2.PhotoID) {
                            idx2 = index2;
                        }
                    });

                    if (idx2 === -1) {
                        this.albumPhotoLinks.push(value);
                    } else {
                        // Do we really need this?
                        this.albumPhotoLinks[idx2] = value;
                    }
                });

                // Exists already, don't need a push then.
            }
        } else {
            // Error
            console.log("Error! This method requires albumid or photoid!!!");
        }
    }

    resetLinkInfo(albumid?: number, photoid?: string) {
        if (albumid) {
            let idx: number = this.linkByAlbum.indexOf(+albumid);
            if (idx === -1) {
                // Do nothing
            } else {
                this.albumPhotoLinks.forEach((value, index, array) => {
                    if (value.AlbumID === albumid) {
                        this.albumPhotoLinks.splice(index, 1);
                    }
                });
            }
        } else if (photoid) {
            let idx: number = this.linkByPhoto.indexOf(photoid);
            if (idx === -1) {
                // Do nothing
            } else {
                this.albumPhotoLinks.forEach((value, index, array) => {
                    if (value.PhotoID === photoid) {
                        this.albumPhotoLinks.splice(index, 1);
                    }
                });
            }
        } else {
            // Remove all
            this.linkByAlbum = new Array<number>();
            this.linkByPhoto = new Array<string>();
            this.albumPhotoLinks = new Array<AlbumPhotoLink>();
        }
    }
}
