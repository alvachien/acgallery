import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatCheckboxModule,
  MatChipsModule,
  MatIconModule,
  MatToolbarModule,
  MatTableModule,
  MatDividerModule,
  MatSnackBarModule,
  MatInputModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhotochangeComponent } from './photochange.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService } from '../services';
import { UserAuthInfo } from '../model';

describe('PhotochangeComponent', () => {
  let component: PhotochangeComponent;
  let fixture: ComponentFixture<PhotochangeComponent>;

  beforeEach(async(() => {
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub: any = new ActivatedRouteUrlStub([new UrlSegment('createbrwfrm', {})] as UrlSegment[]);
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const photoService: any = jasmine.createSpyObj('PhotoService', ['loadAlbumPhoto']);
    const loadAlbumPhotoSpy: any = photoService.loadAlbumPhoto.and.returnValue(of([]));
    const albumService: any = jasmine.createSpyObj('AlbumService', ['loadAlbums', 'loadAlbumContainsPhoto']);
    const loadAlbumsSpy: any = albumService.loadAlbums.and.returnValue(of([]));
    const loadAlbumContainsPhotoSpy: any = albumService.loadAlbumContainsPhoto.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatCardModule,
        FormsModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        MatToolbarModule,
        MatTableModule,
        MatDividerModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatInputModule,
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
        PhotochangeComponent,
      ],
      providers: [
        TranslateService,
        UIStatusService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: PhotoService, useValue: photoService },
        { provide: AlbumService, useValue: albumService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotochangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
