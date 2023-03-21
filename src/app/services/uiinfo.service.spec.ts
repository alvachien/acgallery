import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UIInfoService } from './uiinfo.service';

describe('UIInfoService', () => {
  let service: UIInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UIInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shall work with data', () => {
    service.AlbumIDForPhotoSearching = 2;
    expect(service.AlbumIDForPhotoSearching).toEqual(2);

    service.AlbumInfoForPhotoSearching = 'test';
    expect(service.AlbumInfoForPhotoSearching).toEqual('test');

    service.AlbumInfoForPhotoSearching = undefined;
    expect(service.AlbumInfoForPhotoSearching).toBeUndefined();

    service.AlbumTitleForPhotoSearching = 'test2';
    expect(service.AlbumTitleForPhotoSearching).toEqual('test2');

    service.AlbumTitleForPhotoSearching = undefined;
    expect(service.AlbumTitleForPhotoSearching).toBeUndefined();
  });
});
