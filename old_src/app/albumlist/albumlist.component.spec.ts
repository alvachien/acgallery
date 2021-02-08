import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatIconModule, MatPaginatorModule, MatSnackBarModule } from '@angular/material';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlbumlistComponent } from './albumlist.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService } from '../services';
import { UserAuthInfo } from '../model';

describe('AlbumlistComponent', () => {
  let component: AlbumlistComponent;
  let fixture: ComponentFixture<AlbumlistComponent>;

  beforeEach(async(() => {
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const albumService: any = jasmine.createSpyObj('AlbumService', ['loadAlbums']);
    const loadAlbumsSpy: any = albumService.loadAlbums.and.returnValue(of([]));
    const activatedRouteStub: any = new ActivatedRouteUrlStub([new UrlSegment('createbrwfrm', {})] as UrlSegment[]);

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatGridListModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatSnackBarModule,
        FlexLayoutModule,
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
        AlbumlistComponent,
      ],
      providers: [
        TranslateService,
        UIStatusService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: AlbumService, useValue: albumService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
