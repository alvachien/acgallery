import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UIInfoService } from './uiinfo.service';

describe('UIInfoService', () => {
  let service: UIInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UIInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
