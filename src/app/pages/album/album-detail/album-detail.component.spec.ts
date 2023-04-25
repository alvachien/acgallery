import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper, ActivatedRouteUrlStub, asyncData } from 'src/testing/';
import { PhotoCommonModule } from 'src/app/pages/photo-common/photo-common.module';
import { AlbumDetailComponent } from './album-detail.component';
import { AuthService, OdataService, UIInfoService } from 'src/app/services';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { AlbumHeaderComponent } from '../../album-common/album-header';
import { Album, Photo } from 'src/app/models';
import { SequenceList } from 'actslib';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let fakeData: FakeDataHelper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activatedRouteStub: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  let readAlbumSpy: any;
  let getAlbumRelatedPhotosSpy: any;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();

    odataService = jasmine.createSpyObj('OdataService', [
      'readAlbum',
      'getAlbumRelatedPhotos'
    ]);
    readAlbumSpy = odataService.readAlbum.and.returnValue(of({}));
    getAlbumRelatedPhotosSpy = odataService.getAlbumRelatedPhotos.and.returnValue(of({}));
  });

  beforeEach(async () => {
    const authServiceStub: Partial<AuthService> = {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    activatedRouteStub = new ActivatedRouteUrlStub([new UrlSegment('create', {})] as UrlSegment[]);

    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule, 
        PhotoCommonModule, 
        getTranslocoModule()
      ],
      declarations: [
        AlbumHeaderComponent,
        AlbumDetailComponent
      ],
      providers: [
        { provide: OdataService, useValue: odataService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        UIInfoService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('create mode', () => {
    it('default value', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.isCreateMode).toBeTrue();
    }));
  });

  describe('display mode', () => {
    beforeEach(() => {
      activatedRouteStub.setURL([new UrlSegment('display', {}), new UrlSegment('122', {})] as UrlSegment[]);

      let objAlbum = new Album();
      objAlbum.Id = 1;
      objAlbum.Title = 'test';
      objAlbum.Desp = 'test desp';
      objAlbum.IsPublic = true;
      readAlbumSpy.and.returnValue(asyncData(objAlbum));

      let photos: SequenceList<Photo> = new SequenceList<Photo>();
      let nphoto: Photo = new Photo();
      nphoto.desp = 'test';
      photos.AppendElement(nphoto);
      nphoto = new Photo();
      nphoto.desp = 'test2';
      photos.AppendElement(nphoto);
      getAlbumRelatedPhotosSpy.and.returnValue(asyncData({
        totalCount: 2,
        items: photos
      }));
    });

    it('default value', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.isCreateMode).toBeFalse();
      expect(component.isDisplayMode).toBeTrue();
    }));
  });
});
