import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { FakeDataHelper } from '../testing';
import { TestingDependsModule, getTranslocoModule } from 'src/testing/';
import { AuthService } from './services';

describe('AppComponent', () => {
  let fakeData: FakeDataHelper;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();
  });

  beforeEach(async () => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, getTranslocoModule()],
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
