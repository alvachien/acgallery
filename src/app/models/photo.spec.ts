import { PhotoExif, TagCount, Photo, SelectablePhoto, UpdPhoto } from './';

describe('PhotoExif', () => {
  let tbcObject: PhotoExif;

  beforeEach(() => {
    tbcObject = new PhotoExif();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe('TagCount', () => {
  let tbcObject: TagCount;

  beforeEach(() => {
    tbcObject = new TagCount();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
  });
});

describe('Photo', () => {
  let objInstance: Photo;

  beforeEach(() => {
    objInstance = new Photo();
  });

  it('parseData with IsPublic is true', () => {
    const odata = {
      PhotoId: 'Test 1',
      IsPublic: true,
      Width: 720,
      Height: 480,
      FileUrl: 'test',
      ThumbWidth: 72,
      ThumbHeight: 48,
      ThumbnailFileUrl: 'test',
      fileFormat: 'test',
      uploadedBy: 'test',
      uploadedTime: '2022-01-01',
      OrgFileName: 'test',
      cameraMaker: 'test',
      cameraModel: 'test',
      lensModel: 'test',
      avNumber: 'test',
      shutterSpeed: 'test',
      isoNumber: 'test',
      exifTags: ['test1', 'test2'],
      rating: 3,
      Tags: ['test1', 'test2'],
    };
    objInstance.parseData(odata);
    expect(objInstance.photoId).toEqual(odata.PhotoId);
    expect(objInstance.isPublic).toBeTruthy();
  });

  it('parseData with IsPublic is false', () => {
    const odata = {
      PhotoId: 'Test 2',
      IsPublic: false,
    };
    objInstance.parseData(odata);
    expect(objInstance.photoId).toEqual(odata.PhotoId);
    expect(objInstance.isPublic).toBeFalsy();
  });

  it('generateJson', () => {
    objInstance.photoId = 'Test 1';
    const odata = objInstance.generateJson();
    expect(odata.PhotoId).toEqual(objInstance.photoId);
  });
});

describe('SelectablePhoto', () => {
  let tbcObject: SelectablePhoto;

  beforeEach(() => {
    tbcObject = new SelectablePhoto();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
    expect(tbcObject.isSelected).toBeFalsy();
  });
});

describe('UpdPhoto', () => {
  let tbcObject: UpdPhoto;

  beforeEach(() => {
    tbcObject = new UpdPhoto();
  });

  it('create success', () => {
    expect(tbcObject).toBeTruthy();
    tbcObject.width = 72;
    tbcObject.height = 48;
    expect(tbcObject.dimension).toBeTruthy();
    expect(tbcObject.isPublic).toBeTrue();
    expect(tbcObject.isValid).toBeFalse();

    tbcObject.imgFile = 'test';
    expect(tbcObject.isValid).toBeFalse();
    tbcObject.thumbFile = 'test';
    expect(tbcObject.isValid).toBeFalse();
    tbcObject.title = 'test';
    expect(tbcObject.imgSrc).toBeTruthy();
    expect(tbcObject.thumbSrc).toBeTruthy();
    expect(tbcObject.isValid).toBeTrue();
  });
});
