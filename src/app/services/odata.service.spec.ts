import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OdataService } from './odata.service';

describe('OdataService', () => {
  let service: OdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(OdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
