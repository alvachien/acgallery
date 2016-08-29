import { Observable }               from 'rxjs/Observable';

export class UserInfo {
    public isAuthorized: boolean;
    private currentUser: any;
    private galleryAlbumCreate: string;
    private galleryAlbumChange: string;
    private galleryAlbumDelete: string;
    private galleryPhotoUpload: string;
    private galleryPhotoChange: string;
    private galleryPhotoDelete: string;
    private galleryPhotoUploadSize: string;
    private userName: string;

    private ForAll: string = 'All';
    private ForOwner: string = 'OnlySelf';

    public cleanContent() {
        this.currentUser = null;
        this.isAuthorized = false;
    }
    public setContent(user) {
        if (user) {
            //this.currentUser = user;
            this.isAuthorized = true;

            this.userName = user.profile.name;
            this.galleryAlbumCreate = user.profile.GalleryAlbumCreate;
            this.galleryAlbumChange = user.profile.GalleryAlbumChange;
            this.galleryAlbumDelete = user.profile.GalleryAlbumDelete;
            this.galleryPhotoUpload = user.profile.GalleryPhotoUpload;
            this.galleryPhotoChange = user.profile.GalleryPhotoChange;
            this.galleryPhotoDelete = user.profile.GalleryPhotoDelete;
            this.galleryPhotoUploadSize = user.profile.GalleryPhotoUploadSize;
        } else {
            this.cleanContent();
        }
    }

    public getUserName(): string {
        if (this.userName) {
            return this.userName;
        }

        return "";
    }
    public getUserUploadKBSize(): Array<number> {
        if (this.galleryPhotoUploadSize) {
            let i = this.galleryPhotoUploadSize.indexOf('-');
            if (i != -1) {
                let minSize = +this.galleryPhotoUploadSize.substr(0, i - 1);
                let maxSize = +this.galleryPhotoUploadSize.substr(i);
                return [minSize, maxSize];
            }
        }

        return [0, 0];
    }
    private getObjectRights(strValue : string, usrName? : string): boolean {
        if (strValue) {
            if (strValue === this.ForAll)
                return true;
            if (strValue === this.ForOwner) {
                if (usrName === this.userName)
                    return true;
                return false;
            }
        }

        return false;
    }
    public canCreateAlbum(): boolean {
        return this.getObjectRights(this.galleryAlbumCreate);
    }
    public canChangeAlbum(usrName?: string): boolean {
        return this.getObjectRights(this.galleryAlbumChange, usrName);
    }
    public canDeleteAlbum(usrName?: string): boolean {
        return this.getObjectRights(this.galleryAlbumDelete, usrName);
    }
    public canUploadPhoto(): boolean {
        let brst = this.getObjectRights(this.galleryPhotoUpload);
        if (brst) {
            let sizes = this.getUserUploadKBSize();
            if (sizes[1] <= 0)
                brst = false;
        }

        return brst;
    }
    public canChangePhoto(usrName?: string) {
        return this.getObjectRights(this.galleryPhotoChange, usrName);
    }
    public canDeletePhoto(usrName?: string) {
        return this.getObjectRights(this.galleryPhotoDelete, usrName);
    }
}
