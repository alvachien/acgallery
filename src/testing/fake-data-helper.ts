import { UserAuthInfo, Album, Photo } from '../app/model';
import { User } from 'oidc-client';

/**
 * Fake data helper
 */
export class FakeDataHelper {
  private _currUser: UserAuthInfo;
  private _listAlbums: Album[];
  private _listPhotos: Photo[];

  readonly userID1: string = 'uttest';
  readonly userID1Sub: string = '12345abcdefg';

  constructor() {
    // Empty
  }

  get currentUser(): UserAuthInfo {
    if (this._currUser) {
      return this._currUser;
    }
  }
  get Albums(): Album[] {
    if (this._listAlbums) {
      return this._listAlbums;
    }
  }
  get Photos(): Photo[] {
    if (this._listPhotos) {
      return this._listPhotos;
    }
  }

  public buildCurrentUser(): void {
    this._currUser = new UserAuthInfo();
    let usr: any = {
      profile: {
        name: this.userID1,
        sub: this.userID1Sub,
        mail: 'test@test.com',
        access_token: 'access_token',
      },
    };

    this._currUser.setContent(usr as User);
  }
  public buildAlbums(): void {
    this._listAlbums = [];
    let alb: Album;
    alb = new Album();
    alb.Id = 1;
    alb.Title = 'Test 1';
    alb.Desp = 'Album 1';
    alb.IsPublic = true;
    this._listAlbums.push(alb);
    alb = new Album();
    alb.Id = 2;
    alb.Title = 'Test 2';
    alb.Desp = 'Album 2';
    alb.IsPublic = false;
    this._listAlbums.push(alb);
  }
  public buildPhotos(): void {
    this._listPhotos = [];
  }
}
