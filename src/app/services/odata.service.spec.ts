import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OdataService } from './odata.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FakeDataHelper } from 'src/testing';
import { Album, Photo } from '../models';
import { SequenceList } from 'actslib';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('OdataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: OdataService;
  const apiUrl = `${environment.apiRootUrl}`;
  let fakeData: FakeDataHelper;
  const albumAPI = `${environment.apiRootUrl}Albums`;
  const photoAPI = `${environment.apiRootUrl}Photos`;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildAlbums();
    fakeData.buildPhotos();
    fakeData.buildCurrentUser();
  });

  beforeEach(() => {
    const authServiceStub: Partial<AuthService> = {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OdataService, { provide: AuthService, useValue: authServiceStub }],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created without data', () => {
    service = TestBed.inject(OdataService);
    expect(service).toBeTruthy();
    expect(httpClient).toBeTruthy();
  });

  /// OdataService method tests begin ///
  describe('getMetadata', () => {
    const metadataurl = `${apiUrl}$metadata`;
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected metadata', () => {
      service.getMetadata().subscribe({
        next: (val) => {
          expect(val).toBeTruthy();
        },
        error: (err) => {
          fail(err);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush('<xml></xml>');
    });

    it('should return expected metadata (call twice)', () => {
      service.getMetadata().subscribe({
        next: (val) => {
          expect(val).toBeTruthy();
        },
        error: (err) => {
          fail(err);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush('<xml></xml>');
      httpTestingController.verify();

      // Second call
      service.getMetadata().subscribe({
        next: (val) => {
          expect(val).toBeTruthy();
        },
        error: (err) => {
          fail(err);
        },
      });
      req = httpTestingController.match((callurl) => {
        return callurl.url === metadataurl && callurl.method === 'GET';
      });
      expect(req.length).toEqual(0);
    });

    it('should return error if error occur', () => {
      const msg = '500 Error';
      service.getMetadata().subscribe({
        next: (val) => {
          fail(val);
        },
        error: (err) => {
          expect(err).toBeTruthy();
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === metadataurl;
      });

      // Respond with the mock currencies
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAlbums', () => {
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data (called once)', () => {
      service.getAlbums().subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.totalCount).withContext('should return expected data').toEqual(2);
          // expect(service.Currencies.length).withContext('should have buffered').toEqual(fakeData.currenciesFromAPI.length);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === albumAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      // Respond with the mock currencies
      req.flush({
        '@odata.count': 2,
        value: [
          {
            Id: 21,
            Title: 'Test 21',
          },
          {
            Id: 22,
            Title: 'Test 22',
          },
        ],
      });
    });

    it('should be OK returning no data', () => {
      service.getAlbums().subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.totalCount).withContext('should have empty data array').toEqual(0);
          // expect(service.Currencies.length).withContext('should buffered nothing').toEqual(0);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === albumAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      req.flush({
        '@odata.count': 0,
        value: [],
      }); // Respond with no data
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.getAlbums().subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === albumAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createAlbum', () => {
    let tbcAlbum: Album;

    beforeEach(() => {
      service = TestBed.inject(OdataService);
      tbcAlbum = new Album();
      tbcAlbum.Title = 'test2';
      tbcAlbum.Desp = 'Desp2';
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data (called once)', () => {
      service.createAlbum(tbcAlbum).subscribe({
        next: (rtn: Album) => {
          expect(rtn.Title).withContext('should return expected data').toEqual(tbcAlbum.Title);
          expect(rtn.Desp).withContext('should return expected data').toEqual(tbcAlbum.Desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'POST' && requrl.url === albumAPI;
      });

      // Respond with the mock currencies
      req.flush(tbcAlbum.writeJSONObject());
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.createAlbum(tbcAlbum).subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'POST' && requrl.url === albumAPI;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('readAlbum', () => {
    let tbcAlbum: Album;

    beforeEach(() => {
      service = TestBed.inject(OdataService);
      tbcAlbum = new Album();
      tbcAlbum.Id = 22;
      tbcAlbum.Title = 'test2';
      tbcAlbum.Desp = 'Desp2';
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data (called once)', () => {
      service.readAlbum(22).subscribe({
        next: (rtn: Album) => {
          expect(rtn.Id).withContext('should return expected data').toEqual(tbcAlbum.Id);
          expect(rtn.Title).withContext('should return expected data').toEqual(tbcAlbum.Title);
          expect(rtn.Desp).withContext('should return expected data').toEqual(tbcAlbum.Desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${albumAPI}(22)`;
      });

      // Respond with the mock currencies
      req.flush(tbcAlbum.writeJSONObject());
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.readAlbum(22).subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${albumAPI}(22)`;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAlbumRelatedPhotos', () => {
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data with access code', () => {
      service.getAlbumRelatedPhotos(22, 'test').subscribe({
        next: (rtn: { totalCount: number; items: SequenceList<Photo> }) => {
          expect(rtn.items.Length()).withContext('should return expected data').toEqual(2);
          // expect(rtn.Title).withContext('should return expected data').toEqual(tbcAlbum.Title);
          // expect(rtn.Desp).withContext('should return expected data').toEqual(tbcAlbum.Desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${albumAPI}/GetPhotos(AlbumID=22,AccessCode='test')`;
      });

      // Respond with the mock currencies
      req.flush({
        value: [
          {
            PhotoId: '22',
            Title: 'test1',
            Desp: 'test1',
          },
          {
            PhotoId: '23',
            Title: 'test1',
            Desp: 'test1',
          },
        ],
      });
    });

    it('should return expected data without access code', () => {
      service.getAlbumRelatedPhotos(22).subscribe({
        next: (rtn: { totalCount: number; items: SequenceList<Photo> }) => {
          expect(rtn.items.Length()).withContext('should return expected data').toEqual(2);
          // expect(rtn.Title).withContext('should return expected data').toEqual(tbcAlbum.Title);
          // expect(rtn.Desp).withContext('should return expected data').toEqual(tbcAlbum.Desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${albumAPI}/GetPhotos(AlbumID=22,AccessCode='')`;
      });

      // Respond with the mock currencies
      req.flush({
        value: [
          {
            PhotoId: '22',
            Title: 'test1',
            Desp: 'test1',
          },
          {
            PhotoId: '23',
            Title: 'test1',
            Desp: 'test1',
          },
        ],
      });
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.getAlbumRelatedPhotos(22).subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${albumAPI}/GetPhotos(AlbumID=22,AccessCode='')`;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPhotos', () => {
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data (called once)', () => {
      service.getPhotos().subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.totalCount).withContext('should return expected data').toEqual(2);
          // expect(service.Currencies.length).withContext('should have buffered').toEqual(fakeData.currenciesFromAPI.length);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === photoAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      // Respond with the mock currencies
      req.flush({
        '@odata.count': 2,
        value: [
          {
            PhotoId: 21,
            Title: 'Test 21',
          },
          {
            PhotoId: 22,
            Title: 'Test 22',
          },
        ],
      });
    });

    it('should be OK returning no data', () => {
      service.getPhotos().subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.totalCount).withContext('should have empty data array').toEqual(0);
          // expect(service.Currencies.length).withContext('should buffered nothing').toEqual(0);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === photoAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      req.flush({
        '@odata.count': 0,
        value: [],
      }); // Respond with no data
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.getPhotos().subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === photoAPI && requrl.params.has('$count');
      });
      expect(req.request.params.get('$count')).toEqual('true');

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPhotoEXIF', () => {
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data (called once)', () => {
      service.getPhotoEXIF('photo-id').subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.CameraMaker).withContext('should return expected data').toEqual('CameraMaker');
          // expect(service.Currencies.length).withContext('should have buffered').toEqual(fakeData.currenciesFromAPI.length);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${photoAPI}('photo-id')`;
      });
      expect(req.request.params.get('$select')).toEqual(
        'PhotoId,CameraMaker,CameraModel,LensModel,AVNumber,ShutterSpeed,ISONumber'
      );

      // Respond with the mock currencies
      req.flush({
        CameraMaker: 'CameraMaker',
        CameraModel: 'CameraModel',
        LensModel: 'LensModel',
        AVNumber: 'AVNumber',
      });
    });

    it('should be OK returning no data', () => {
      service.getPhotoEXIF('photo-id').subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          expect(data.CameraMaker).withContext('should have empty data array').toBeUndefined();
          // expect(service.Currencies.length).withContext('should buffered nothing').toEqual(0);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${photoAPI}('photo-id')`;
      });
      expect(req.request.params.get('$select')).toEqual(
        'PhotoId,CameraMaker,CameraModel,LensModel,AVNumber,ShutterSpeed,ISONumber'
      );

      req.flush({}); // Respond with no data
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.getPhotoEXIF('photo-id').subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'GET' && requrl.url === `${photoAPI}('photo-id')`;
      });
      expect(req.request.params.get('$select')).toEqual(
        'PhotoId,CameraMaker,CameraModel,LensModel,AVNumber,ShutterSpeed,ISONumber'
      );

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPhoto', () => {
    let tbcPhoto: Photo;

    beforeEach(() => {
      service = TestBed.inject(OdataService);
      tbcPhoto = new Photo();
      tbcPhoto.photoId = 'test';
      tbcPhoto.desp = 'test';
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data when create success', () => {
      service.createPhoto(tbcPhoto).subscribe({
        next: (rtn: Photo) => {
          expect(rtn.photoId).withContext('should return expected data').toEqual(tbcPhoto.photoId);
          expect(rtn.desp).withContext('should return expected data').toEqual(tbcPhoto.desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'POST' && requrl.url === photoAPI;
      });

      // Respond with the mock currencies
      req.flush(tbcPhoto.generateJson());
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.createPhoto(tbcPhoto).subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'POST' && requrl.url === photoAPI;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('changePhoto', () => {
    let tbcPhoto: Photo;
    beforeEach(() => {
      service = TestBed.inject(OdataService);
      tbcPhoto = new Photo();
      tbcPhoto.photoId = 'test';
      tbcPhoto.desp = 'test';
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data when change success', () => {
      service.changePhoto(tbcPhoto).subscribe({
        next: (rtn: Photo) => {
          expect(rtn.photoId).withContext('should return expected data').toEqual(tbcPhoto.photoId);
          expect(rtn.desp).withContext('should return expected data').toEqual(tbcPhoto.desp);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'PUT' && requrl.url === `${photoAPI}('${tbcPhoto.photoId}')`;
      });

      // Respond with the mock currencies
      req.flush(tbcPhoto.generateJson());
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.changePhoto(tbcPhoto).subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'PUT' && requrl.url === `${photoAPI}('${tbcPhoto.photoId}')`;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePhoto', () => {
    beforeEach(() => {
      service = TestBed.inject(OdataService);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should return expected data when change success', () => {
      service.deletePhoto('22').subscribe({
        next: (rtn: boolean) => {
          expect(rtn).withContext('should return expected data').toBeTrue();
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'DELETE' && requrl.url === `${photoAPI}('22')`;
      });

      // Respond with the mock currencies
      req.flush(true);
    });

    it('should return error in case error appear', () => {
      const msg = 'Error 404';
      service.deletePhoto('22').subscribe({
        next: () => {
          fail('expected to fail');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          expect(err.toString()).toContain(msg);
        },
      });

      // Service should have made one request to GET currencies from expected URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req: any = httpTestingController.expectOne((requrl: any) => {
        return requrl.method === 'DELETE' && requrl.url === `${photoAPI}('22')`;
      });

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });
});
