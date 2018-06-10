import { User } from 'oidc-client';

/**
 * User operation authority
 */
export enum UserOperationAuthEnum {
  All = 1,
  OwnerOnly = 2,
}

/**
 * User detail
 */
export class UserDetail {
  public userId: string;
  public displayAs: string;
  public email: string;
  public others: string;
  public uploadFileMinSize: number;
  public uploadFileMaxSize: number;
  public albumCreate: boolean;
  public albumChange: UserOperationAuthEnum;
  public albumDelete: UserOperationAuthEnum;
  public albumRead: UserOperationAuthEnum;
  public photoUpload: boolean;
  public photoChange: UserOperationAuthEnum;
  public photoDelete: UserOperationAuthEnum;

  public onSetData(data: any) {
    if (data && data.userID) {
      this.userId = data.userID;
    }
    if (data && data.displayAs) {
      this.displayAs = data.displayAs;
    }
    if (data && data.email) {
      this.email = data.email;
    }
    if (data && data.others) {
      this.others = data.others;
    }
    if (data && data.uploadFileMinSize) {
      this.uploadFileMinSize = +data.uploadFileMinSize;
    }
    if (data && data.uploadFileMaxSize) {
      this.uploadFileMaxSize = +data.uploadFileMaxSize;
    }
    if (data && data.albumCreate) {
      this.albumCreate = <boolean>data.albumCreate;
    }
    if (data && data.albumChange) {
      this.albumChange = <UserOperationAuthEnum>data.albumChange;
    }
    if (data && data.albumDelete) {
      this.albumDelete = <UserOperationAuthEnum>data.albumDelete;
    }
    if (data && data.albumRead) {
      this.albumRead = <UserOperationAuthEnum>data.albumRead;
    }
    if (data && data.photoUpload) {
      this.photoUpload = <boolean>data.photoUpload;
    }
    if (data && data.photoChange) {
      this.photoChange = <UserOperationAuthEnum>data.photoChange;
    }
    if (data && data.photoDelete) {
      this.photoDelete = <UserOperationAuthEnum>data.photoDelete;
    }
  }
}

// export class UserHistory {
//   public UserId: string;
//   public SeqNo: number;
//   public HistType: number;
//   public TimePoint: Date;
//   public Others: string;

//   public onSetData(data: any) {

//     this.UserId = data.userId;
//     this.SeqNo = data.seqNo;
//     this.HistType = data.histType;
//     this.TimePoint = data.timePoint;
//     this.Others = data.others;
//   }
// }

/**
 * User Auth. info
 */
export class UserAuthInfo {
  public isAuthorized: boolean;
  private currentUser: User;
  private userId: string;
  private userName: string;
  private accessToken: string;

  // private ForAll: string = 'All';
  // private OnlyOwner: string = 'OnlyOwner';

  // private galleryAlbumCreate: string;
  // private galleryAlbumChange: string;
  // private galleryAlbumDelete: string;
  // private galleryPhotoUpload: string;
  // private galleryPhotoChange: string;
  // private galleryPhotoDelete: string;
  // private galleryPhotoUploadSize: string;

  public setContent(user: User): void {
    if (user) {
      this.currentUser = user;
      this.isAuthorized = true;

      this.userId = user.profile.sub;
      this.userName = user.profile.name;
      this.accessToken = user.access_token;

      // this.galleryAlbumCreate = user.profile.GalleryAlbumCreate;
      // this.galleryAlbumChange = user.profile.GalleryAlbumChange;
      // this.galleryAlbumDelete = user.profile.GalleryAlbumDelete;
      // this.galleryPhotoUpload = user.profile.GalleryPhotoUpload;
      // this.galleryPhotoChange = user.profile.GalleryPhotoChange;
      // this.galleryPhotoDelete = user.profile.GalleryPhotoDelete;
      // this.galleryPhotoUploadSize = user.profile.GalleryPhotoUploadSize;
    } else {
      this.cleanContent();
    }
  }

  public cleanContent(): void {
    this.currentUser = null;
    this.isAuthorized = false;
  }

  public getUserName(): string {
    return this.userName;
  }
  public getAccessToken(): string {
    return this.accessToken;
  }
  public getUserID(): string {
    return this.userId;
  }
  // public getUserUploadKBSize(): number[] {
  //   if (this.galleryPhotoUploadSize) {
  //     const i = this.galleryPhotoUploadSize.indexOf('-');
  //     if (i !== -1) {
  //       const minSize = +this.galleryPhotoUploadSize.substr(0, i - 1);
  //       const maxSize = +this.galleryPhotoUploadSize.substr(i + 1);
  //       return [minSize, maxSize];
  //     }
  //   }

  //   return [0, 0];
  // }
  // private getObjectRights(strValue: string, usrName?: string): boolean {
  //   if (strValue) {
  //     if (strValue === this.ForAll) {
  //       return true;
  //     }
  //     if (strValue === this.OnlyOwner) {
  //       if (usrName === this.userName) {
  //         return true;
  //       }

  //       return false;
  //     }
  //   }

  //   return false;
  // }
  // public canCreateAlbum(): boolean {
  //   return this.getObjectRights(this.galleryAlbumCreate);
  // }
  // public canChangeAlbum(crterName?: string): boolean {
  //   return this.getObjectRights(this.galleryAlbumChange, crterName);
  // }
  // public canDeleteAlbum(crterName?: string): boolean {
  //   return this.getObjectRights(this.galleryAlbumDelete, crterName);
  // }
  // public canUploadPhoto(): boolean {
  //   let brst = this.getObjectRights(this.galleryPhotoUpload);
  //   if (brst) {
  //     const sizes = this.getUserUploadKBSize();
  //     if (sizes[1] <= 0) {
  //       brst = false;
  //     }
  //   }

  //   return brst;
  // }
  // public canChangePhoto(updrName?: string) {
  //   return this.getObjectRights(this.galleryPhotoChange, updrName);
  // }
  // public canDeletePhoto(updrName?: string) {
  //   return this.getObjectRights(this.galleryPhotoDelete, updrName);
  // }
}
