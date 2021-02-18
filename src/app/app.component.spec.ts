import { TestBed, } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterLinkStubDirective } from '../testing';

describe('AppComponent', () => {
  beforeEach(async() => {
    // const authServiceStub: Partial<AuthService> = {};
    // authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
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
