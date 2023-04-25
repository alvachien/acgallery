import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { TestingDependsModule, asyncData, getTranslocoModule } from 'src/testing/';
import { PhotoCommonModule } from 'src/app/pages/photo-common/photo-common.module';
import { PhotoListComponent } from './photo-list.component';
import { OdataService, UIInfoService } from 'src/app/services';
import { Photo } from 'src/app/models';
import { SequenceList } from 'actslib';

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  let getPhotosSpy: any;

  beforeAll(() => {
    odataService = jasmine.createSpyObj('OdataService', ['getPhotos']);
    getPhotosSpy = odataService.getPhotos.and.returnValue(of([]));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, PhotoCommonModule, getTranslocoModule()],
      declarations: [PhotoListComponent],
      providers: [{ provide: OdataService, useValue: odataService }, UIInfoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init with data', fakeAsync(() => {
    let listPhotos: SequenceList<Photo> = new SequenceList<Photo>();
    let epto = new Photo();
    epto.photoId = 'aaa';
    listPhotos.AppendElement(epto);
    epto = new Photo();
    epto.photoId = 'aaa';
    listPhotos.AppendElement(epto);
    getPhotosSpy.and.returnValue(asyncData({
      totalCount: 2,
      items: listPhotos,
    }));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.photos.length).toEqual(2);

    flush();
    discardPeriodicTasks();
  }));
});
