import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OdataService } from './odata.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('OdataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: OdataService;
  let apiUrl = `${environment.apiRootUrl}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        OdataService,
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OdataService);
  });

  it('should be created without data', () => {
    expect(service).toBeTruthy();
  });

  /// OdataService method tests begin ///
  describe('getMetadata', () => {
    let metadataurl = `${apiUrl}$metadata`;
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected metadata', () => {
      service.getMetadata().subscribe({
        next: val => {
          expect(val).toBeTruthy();
        },
        error: err => {
          fail(err);
        }
      });

      // Service should have made one request to GET currencies from expected URL
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET'
          && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush('<xml></xml>');
    });

    it('should return expected metadata (call twice)', () => {
      service.getMetadata().subscribe({
        next: val => {
          expect(val).toBeTruthy();
        },
        error: err => {
          fail(err);
        }
      });

      // Service should have made one request to GET currencies from expected URL
      let req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET'
          && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush('<xml></xml>');
      httpTestingController.verify();

      // Second call
      service.getMetadata().subscribe({
        next: val => {
          expect(val).toBeTruthy();
        },
        error: err => {
          fail(err);
        }
      });
      req = httpTestingController.match(callurl => {
        return callurl.url === metadataurl
          && callurl.method === 'GET';
      });
      expect(req.length).toEqual(0);
    });

    it('should return error if error occur', () => {      
      const msg = '500 Error';
      service.getMetadata().subscribe({
        next: val => {
          fail(val);
        },
        error: err => {
          expect(err).toBeTruthy();
        }
      });

      // Service should have made one request to GET currencies from expected URL
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET'
          && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });    
  });
});
