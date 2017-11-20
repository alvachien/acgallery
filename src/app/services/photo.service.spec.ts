import { TestBed, inject } from '@angular/core/testing';

import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoService]
    });
  });

  it('should ...', inject([PhotoService], (service: PhotoService) => {
    expect(service).toBeTruthy();
  }));
});
