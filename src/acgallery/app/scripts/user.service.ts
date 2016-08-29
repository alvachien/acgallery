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
        } else {
            this.cleanContent();
        }
    }

    public getUserName(): string {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.name) {
            return this.currentUser.profile.name;
        }

        return "";
    }
    public getUserMaxUploadKBSize(): number {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.GalleryPhotoUploadMaxSize) {
            return +this.currentUser.profile.GalleryPhotoUploadMaxSize;
        }

        return 0;
    }
    public getUserMinUploadKBSize(): number {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.GalleryPhotoUploadMinSize) {
            return +this.currentUser.profile.GalleryPhotoUploadMinSize;
        }

        return 0;
    }
    public getUserAlbumCreate(): boolean {
        if (this.isAuthorized && this.currentUser && this.currentUser.profile && this.currentUser.profile.GalleryAlbumCreate) {
            this.currentUser.profile.GalleryAlbumCreate;
        }
        return false;
    }
}