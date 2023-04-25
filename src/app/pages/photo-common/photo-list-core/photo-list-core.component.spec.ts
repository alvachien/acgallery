import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { PhotoListCoreComponent } from './photo-list-core.component';
import { TestingDependsModule, asyncData, getTranslocoModule } from 'src/testing/';
import { OdataService, UIInfoService } from 'src/app/services';
import { Photo } from 'src/app/models';

describe('PhotoListCoreComponent', () => {
  let component: PhotoListCoreComponent;
  let fixture: ComponentFixture<PhotoListCoreComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  let deletePhotoSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  let getPhotoEXIFSpy: any;

  beforeEach(async () => {
    odataService = jasmine.createSpyObj('OdataService', ['deletePhoto', 'getPhotoEXIF']);
    deletePhotoSpy = odataService.deletePhoto.and.returnValue(of(true));
    getPhotoEXIFSpy = odataService.getPhotoEXIF.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, getTranslocoModule()],
      declarations: [PhotoListCoreComponent],
      providers: [{ provide: OdataService, useValue: odataService }, UIInfoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoListCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get EXIF', fakeAsync(() => {
    getPhotoEXIFSpy.and.returnValue(asyncData({}));

    let pto: Photo = new Photo();
    component.onPhotoViewEXIF(pto);

    tick();
    fixture.detectChanges();
    expect(component.isExifVisible).toBeTrue();

    component.handleExifDlgCancel();
    tick();
    fixture.detectChanges();
  }));

  it('Delete Photo', fakeAsync(() => {
    deletePhotoSpy.and.returnValue(asyncData(true));

    let pto: Photo = new Photo();
    pto.photoId = '22';
    component.onDeletePhoto(pto);

    tick();
    fixture.detectChanges();
  }));
});
