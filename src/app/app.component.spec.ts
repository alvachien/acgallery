import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { FakeDataHelper } from '../testing';
import { TestingDependsModule, getTranslocoModule } from 'src/testing/';
import { AuthService } from './services';

describe('AppComponent', () => {
  let fakeData: FakeDataHelper;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();
  });

  beforeEach(async () => {
    const authServiceStub: Partial<AuthService> = {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, getTranslocoModule()],
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', async () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('init test', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.currentVersion).toBeTruthy();

    flush();
    discardPeriodicTasks();
  }));
});
