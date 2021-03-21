import { Photo } from './';

describe('Photo', () => {
  let objInstance: Photo;

  beforeEach(() => {
    objInstance = new Photo();
  });

  it('parseData with IsPublic is true', () => {
    const odata = {
      PhotoId: 'Test 1',
      IsPublic: true
    };
    objInstance.parseData(odata);
    expect(objInstance.photoId).toEqual(odata.PhotoId);
    expect(objInstance.isPublic).toBeTruthy();
  });

  it('parseData with IsPublic is false', () => {
    const odata = {
      PhotoId: 'Test 2',
      IsPublic: false
    };
    objInstance.parseData(odata);
    expect(objInstance.photoId).toEqual(odata.PhotoId);
    expect(objInstance.isPublic).toBeFalsy();
  });

  it('generateJson', () => {
    objInstance.photoId = 'Test 1';
    let odata = objInstance.generateJson();
    expect(odata.PhotoId).toEqual(objInstance.photoId);
  });
});
