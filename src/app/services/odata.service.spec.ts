import { TestBed } from '@angular/core/testing';

import { OdataService } from './odata.service';

describe('OdataService', () => {
  let service: OdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
