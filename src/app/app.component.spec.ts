import { TestBed, } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterLinkStubDirective } from '../testing';
import { TestingDependsModule, getTranslocoModule } from 'src/testing/';

describe('AppComponent', () => {
  beforeEach(async() => {
    // const authServiceStub: Partial<AuthService> = {};
    // authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        getTranslocoModule(),
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
