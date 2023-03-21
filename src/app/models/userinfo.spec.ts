import { UserAuthInfo, UserDetail } from "./";

describe("UserDetail", () => {
  let tbcObject: UserDetail;

  beforeEach(() => {
    tbcObject = new UserDetail();
  });

  it("shall create success", () => {
    expect(tbcObject).toBeTruthy();
  });

  it("onSetData", () => {
    expect(tbcObject).toBeTruthy();

    tbcObject.onSetData({
      UserID: "Test",
      DisplayAs: "Test",
      email: "Test",
      others: "test",
      UploadFileMinSize: 2048,
      UploadFileMaxSize: 4096,
      AlbumCreate: true,
      AlbumChange: true,
      AlbumRead: true,
      PhotoUpload: true,
      PhotoChange: true,
      PhotoDelete: true,
    });
  });
});

describe("UserAuthInfo", () => {
  let authinfo: UserAuthInfo;
  let usrvalue: any;

  beforeEach(() => {
    authinfo = new UserAuthInfo();
    usrvalue = {
      userId: "user1_sub",
      userName: "user1_mail",
      accessToken: "user1_access_token",
    };
  });

  it("init: not authorized", () => {
    expect(authinfo).toBeTruthy();
    expect(authinfo.isAuthorized).toBeFalsy();
  });

  it("setContent shall work", () => {
    expect(authinfo.isAuthorized).toBeFalsy();

    authinfo.setContent(usrvalue);
    expect(authinfo.isAuthorized).toBeTruthy();
    if (usrvalue.profile) {
      expect(authinfo.getUserName()).toEqual(usrvalue.profile?.name);
      expect(authinfo.getUserId()).toEqual(usrvalue.profile?.sub);
      //expect(authinfo.getUserMailbox()).toEqual(usrvalue.profile['mail']);
      expect(authinfo.getAccessToken()).toEqual(usrvalue.access_token);
    }

    authinfo.cleanContent();
    expect(authinfo.isAuthorized).toBeFalsy();
    expect(authinfo.getUserName()).toBeUndefined();
    expect(authinfo.getUserId()).toBeUndefined();
    //expect(authinfo.getUserMailbox()).toBeUndefined();
    expect(authinfo.getAccessToken()).toBeUndefined();
  });
});
