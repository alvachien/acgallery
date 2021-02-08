import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatPaginatorModule,
  MatCheckboxModule, MatSelectModule, MatInputModule, } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { User } from 'oidc-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserDetailComponent } from './user-detail.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService, UserDetailService } from '../services';
import { UserAuthInfo } from '../model';
import { EventEmitter } from '@angular/core';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async(() => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    authServiceStub.userLoadededEvent = new EventEmitter<User>();
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
            loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderTestFactory,
            deps: [HttpClient],
            },
        }),
      ],
      declarations: [
        UserDetailComponent,
      ],
      providers: [
        TranslateService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: UserDetailService, useValue: userDetailSrv },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
