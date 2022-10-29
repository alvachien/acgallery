import { UserDetail } from './';

describe('UserDetail', () => {
  let tbcObject: UserDetail;

  beforeEach(() => {
    tbcObject = new UserDetail();
  });

  it('shall create success', () => {
    expect(tbcObject).toBeTruthy();
  });

  it('onSetData', () => {
    expect(tbcObject).toBeTruthy();

    tbcObject.onSetData({
        "UserID": "Test",
        "DisplayAs": "Test",
        "email": "Test",
        "others": "test",
        "UploadFileMinSize": 2048,
        "UploadFileMaxSize": 4096,
        "AlbumCreate": true,
        "AlbumChange": true,
        "AlbumRead": true,
        "PhotoUpload": true,
        "PhotoChange": true,
        "PhotoDelete": true
    });
  });
});
