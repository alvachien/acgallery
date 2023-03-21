import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PhotoListCoreComponent } from './photo-list-core.component';
import { TestingDependsModule, getTranslocoModule } from 'src/testing/';
import { OdataService, UIInfoService } from 'src/app/services';

describe('PhotoListCoreComponent', () => {
  let component: PhotoListCoreComponent;
  let fixture: ComponentFixture<PhotoListCoreComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let deletePhotoSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
});
