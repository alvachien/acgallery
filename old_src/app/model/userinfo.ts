import { User } from 'oidc-client';
import { UserOperationAuthEnum } from './common';

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

/**
 * User Auth. info
 */
export class UserAuthInfo {
  public isAuthorized: boolean;
  private currentUser: User;
  private userId: string;
  private userName: string;
  private accessToken: string;

  public setContent(user: User): void {
    if (user) {
      this.currentUser = user;
      this.isAuthorized = true;

      this.userId = user.profile.sub;
      this.userName = user.profile.name;
      this.accessToken = user.access_token;
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
}
