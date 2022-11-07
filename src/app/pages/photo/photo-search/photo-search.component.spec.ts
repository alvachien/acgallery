import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OdataService, UIInfoService } from 'src/app/services';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper } from 'src/testing/';
import { PhotoSearchComponent } from './photo-search.component';

describe('PhotoSearchComponent', () => {
  let component: PhotoSearchComponent;
  let fixture: ComponentFixture<PhotoSearchComponent>;
  let fakeData: FakeDataHelper;
  let odataSrv: any;
  let searchPhotosSpy: any;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();

    odataSrv = jasmine.createSpyObj('OdataService', [
      'searchPhotos'
    ]);
    searchPhotosSpy = odataSrv.searchPhotos.and.returnValue(of([]));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        getTranslocoModule(),
      ],
      declarations: [ PhotoSearchComponent ],
      providers: [
        { provide: OdataService, useValue: odataSrv  },
        UIInfoService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
