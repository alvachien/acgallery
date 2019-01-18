import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AlbumService } from './album.service';
import { AuthService } from './auth.service';
import { UserAuthInfo } from '../model';
import { FakeDataHelper } from '../../testing';

describe('AlbumService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fakeData: FakeDataHelper;
  let service: AlbumService;

  beforeEach(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();
    fakeData.buildAlbums();

    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AlbumService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AlbumService);
  });

  it('1. should create...', () => {
    expect(service).toBeTruthy();
  });

  /// AlbumService method tests begin ///
  // loadKeyFigures
  // createAlbum
  // createAlbumPhotoLink
  // updateAlbumPhotoByAlbum
  // updateAlbumPhotoByPhoto
  // updateMetadata
  // loadAlbum
  // loadAlbumContainsPhoto
  // deleteAlbum

  describe('2. loadAlbums', () => {
    beforeEach(() => {
      service = TestBed.get(AlbumService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected albums (called once)', () => {

      service.loadAlbums().subscribe(
        (data: any) => {
          expect(data.length).toEqual(fakeData.Albums.length, 'should return expected albums');
        },
        (fail: any) => {
          // Empty
        },
      );

      // Service should have made one request to GET account categories from expected URL
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === environment.AlbumAPIUrl;
       });

      // Respond with the mock account categories
      req.flush(fakeData.Albums);
    });

    it('should be OK returning no albums', () => {
      service.loadAlbums().subscribe(
        (data: any) => {
          expect(data.length).toEqual(0, 'should have empty albums array');
        },
        (fail: any) => {
          // Empty
        },
      );

      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === environment.AlbumAPIUrl;
      });

      req.flush([]); // Respond with no data
    });

    it('should return error in case error appear', () => {
      const msg: string = 'Deliberate 404';
      service.loadAlbums().subscribe(
        (data: any) => {
          fail('expected to fail');
        },
        (error: any) => {
          expect(error).toContain(msg);
        },
      );

      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === environment.AlbumAPIUrl;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected albums (called multiple times)', () => {
      service.loadAlbums().subscribe();
      service.loadAlbums().subscribe();
      service.loadAlbums().subscribe(
        (data: any) => {
          expect(data.length).toEqual(fakeData.Albums.length, 'should return expected albums');
        },
        (fail: any) => {
          // Do nothing
        },
      );
      const reqs: any = httpTestingController.match((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === environment.AlbumAPIUrl;
      });
      expect(reqs.length).toEqual(3);
      reqs[0].flush(fakeData.Albums);
      reqs[1].flush([]);
      reqs[2].flush(fakeData.Albums);
    });
  });
});
