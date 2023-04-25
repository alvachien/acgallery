import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { of } from 'rxjs';
import { OdataService, UIInfoService } from 'src/app/services';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper, ActivatedRouteUrlStub, asyncData } from 'src/testing/';
import { PhotoSearchComponent } from './photo-search.component';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { SequenceList } from 'actslib';
import { Photo } from 'src/app/models';

describe('PhotoSearchComponent', () => {
  let component: PhotoSearchComponent;
  let fixture: ComponentFixture<PhotoSearchComponent>;
  let fakeData: FakeDataHelper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activatedRouteStub: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataSrv: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  let searchPhotosSpy: any;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();

    odataSrv = jasmine.createSpyObj('OdataService', ['searchPhotos']);
    searchPhotosSpy = odataSrv.searchPhotos.and.returnValue(of([]));
  });

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteUrlStub([new UrlSegment('search', {})] as UrlSegment[]);

    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        NzEmptyModule,
        NzPageHeaderModule,
        NzBreadCrumbModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
      ],
      declarations: [PhotoSearchComponent],
      providers: [
        { provide: OdataService, useValue: odataSrv }, 
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        UIInfoService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSearchComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('while search', () => {
    beforeEach(() => {
      let photos: SequenceList<Photo> = new SequenceList<Photo>();
      let nphoto: Photo = new Photo();
      nphoto.desp = 'test';
      photos.AppendElement(nphoto);
      nphoto = new Photo();
      nphoto.desp = 'test2';
      photos.AppendElement(nphoto);
      searchPhotosSpy.and.returnValue(asyncData({
        totalCount: 2,
        items: photos
      }));
    });

    it('first test', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.filters.length).toEqual(1);
      component.filters[0].fieldName = 'Title';
      //component.filters[0].valueType = 2;
      component.filters[0].value = ['test'];

      component.onAddFilter();
      component.filters[1].fieldName = 'ISONumber';
      //component.filters[0].valueType = 1;
      component.filters[1].value = [100];

      component.onFieldSelectionChanged(component.filters[0]);
      component.onFieldSelectionChanged(component.filters[1]);
      component.onSearch();

      tick();
      fixture.detectChanges();
      expect(component.photos.length).toEqual(2);

      component.onRemoveFilter(1);
    }));
  });

  describe('while searchinalbum', () => {
    beforeEach(() => {
      activatedRouteStub.setURL([new UrlSegment('searchinalbum', {}), new UrlSegment('122', {})] as UrlSegment[]);

      let photos: SequenceList<Photo> = new SequenceList<Photo>();
      let nphoto: Photo = new Photo();
      nphoto.desp = 'test';
      photos.AppendElement(nphoto);
      nphoto = new Photo();
      nphoto.desp = 'test2';
      photos.AppendElement(nphoto);
      searchPhotosSpy.and.returnValue(asyncData({
        totalCount: 2,
        items: photos
      }));
    });

    it('first test', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.filters.length).toEqual(1);
    }));
  });
});
