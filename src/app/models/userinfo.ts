import { User } from 'oidc-client';
import { UserOperationAuthEnum } from './common';

/**
 * User detail
 */
export class UserDetail {
  public userId: string = '';
  public displayAs: string = '';
  public email: string = '';
  public others: string = '';
  public uploadFileMinSize: number = 0;
  public uploadFileMaxSize: number = 0;
  public albumCreate: boolean = false;
  public albumChange: UserOperationAuthEnum = UserOperationAuthEnum.All;
  public albumDelete: UserOperationAuthEnum = UserOperationAuthEnum.All;
  public albumRead: UserOperationAuthEnum = UserOperationAuthEnum.All;
  public photoUpload: boolean = false;
  public photoChange: UserOperationAuthEnum = UserOperationAuthEnum.All;
  public photoDelete: UserOperationAuthEnum = UserOperationAuthEnum.All;

  public onSetData(data: any) {
    if (data && data.UserID) {
      this.userId = data.UserID;
    }
    if (data && data.DisplayAs) {
      this.displayAs = data.DisplayAs;
    }
    if (data && data.email) {
      this.email = data.email;
    }
    if (data && data.others) {
      this.others = data.others;
    }
    if (data && data.UploadFileMinSize) {
      this.uploadFileMinSize = +data.UploadFileMinSize;
    }
    if (data && data.UploadFileMaxSize) {
      this.uploadFileMaxSize = +data.UploadFileMaxSize;
    }
    if (data && data.AlbumCreate) {
      this.albumCreate = data.AlbumCreate as boolean;
    }
    if (data && data.AlbumChange) {
      this.albumChange = data.AlbumChange as UserOperationAuthEnum;
    }
    if (data && data.AlbumDelete) {
      this.albumDelete = data.AlbumDelete as UserOperationAuthEnum;
    }
    if (data && data.AlbumRead) {
      this.albumRead = data.AlbumRead as UserOperationAuthEnum;
    }
    if (data && data.PhotoUpload) {
      this.photoUpload = data.PhotoUpload as boolean;
    }
    if (data && data.PhotoChange) {
      this.photoChange = data.PhotoChange as UserOperationAuthEnum;
    }
    if (data && data.PhotoDelete) {
      this.photoDelete = data.PhotoDelete as UserOperationAuthEnum;
    }
  }
}

/**
 * User Auth. info
 */
export class UserAuthInfo {
  public isAuthorized: boolean = false;
  private currentUser?: User;
  private userId: string = '';
  private userName: string = '';
  private accessToken: string = '';

  public setContent(user: User): void {
    if (user) {
      this.currentUser = user;
      this.isAuthorized = true;

      this.userId = user.profile.sub;
      this.userName = user.profile.name!;
      this.accessToken = user.access_token;
    } else {
      this.cleanContent();
    }
  }

  public cleanContent(): void {
    this.currentUser = undefined;
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
}
