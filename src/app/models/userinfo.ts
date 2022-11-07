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
  private userName?: string;
  private userId?: string;
  private userMailbox?: string;
  private accessToken?: string;

  public isAuthorized: boolean = false;

  public setContent(user: {
    userId?: string;
    userName?: string;
    accessToken?: string;  
  }): void {
    if (user) {
      this.isAuthorized = true;

      this.userName = user.userName;
      this.userId = user.userId;
      // this.userMailbox = user.profile['mail'];
      this.accessToken = user.accessToken;
    } else {
      this.cleanContent();
    }
  }

  public cleanContent(): void {
    this.isAuthorized = false;
    this.userName = undefined;
    this.userId = undefined;
    this.userMailbox = undefined;
    this.accessToken = undefined;
  }

  public getUserName(): string | undefined {
    return this.userName;
  }
  public getUserId(): string | undefined {
    return this.userId;
  }
  public getAccessToken(): string | undefined {
    return this.accessToken;
  }
  public getUserMailbox(): string | undefined {
    return this.userMailbox;
  }
}
