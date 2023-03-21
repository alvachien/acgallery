import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper } from 'src/testing/';
import { PhotoCommonModule } from 'src/app/pages/photo-common/photo-common.module';
import { AlbumDetailComponent } from './album-detail.component';
import { AuthService, OdataService, UIInfoService } from 'src/app/services';
import { BehaviorSubject, of } from 'rxjs';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let fakeData: FakeDataHelper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odataService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let readAlbumSpy: any;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();

    odataService = jasmine.createSpyObj('OdataService', ['readAlbum']);
    readAlbumSpy = odataService.readAlbum.and.returnValue(of({}));
  });

  beforeEach(async () => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, PhotoCommonModule, getTranslocoModule()],
      declarations: [AlbumDetailComponent],
      providers: [{ provide: OdataService, useValue: odataService }, UIInfoService],
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
});
