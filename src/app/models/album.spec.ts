import {
  Album,
  AlbumPhotoByAlbum,
  AlbumPhotoByPhoto,
  AlbumPhotoLink,
} from "./";

describe("Album", () => {
  let album: Album;

  beforeEach(() => {
    album = new Album();
  });

  it("parseData", () => {
    const odata = {
      AccessCodeHint: "aaa",
      CreatedAt: "2018-05-15T07:16:36.477+08:00",
      CreatedBy: "aaa",
      Desp: "May 15 2018",
      Id: 2005,
      IsPublic: true,
      Title: "May 15 2018",
    };

    album.parseData(odata);

    expect(album.Title).toEqual(odata.Title);
    expect(album.IsPublic).toEqual(odata.IsPublic);
    // expect(album.CreatedAt).toEqual(odata.CreatedAt);
    expect(album.Desp).toEqual(odata.Desp);
    expect(album.accessCodeHint).toEqual(odata.AccessCodeHint);
  });
});

describe("AlbumPhotoLink", () => {
  let tbcObject: AlbumPhotoLink;

  beforeEach(() => {
    tbcObject = new AlbumPhotoLink();
  });

  it("create success", () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe("AlbumPhotoByPhoto", () => {
  let tbcObject: AlbumPhotoByPhoto;

  beforeEach(() => {
    tbcObject = new AlbumPhotoByPhoto();
  });

  it("create success", () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe("AlbumPhotoByAlbum", () => {
  let tbcObject: AlbumPhotoByAlbum;

  beforeEach(() => {
    tbcObject = new AlbumPhotoByAlbum();
  });

  it("create success", () => {
    expect(tbcObject).toBeTruthy();
  });
});
