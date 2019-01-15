import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatSelectModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatPaginatorModule,
  MatDividerModule,
  MatSnackBarModule, } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhotoSearchComponent } from './photo-search.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService } from '../services';
import { OperatorFilterPipe } from '../pipes';
import { UserAuthInfo } from '../model';

describe('PhotoSearchComponent', () => {
  let component: PhotoSearchComponent;
  let fixture: ComponentFixture<PhotoSearchComponent>;

  beforeEach(async(() => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub: any = new ActivatedRouteUrlStub([new UrlSegment('createbrwfrm', {})] as UrlSegment[]);
    const photoService: any = jasmine.createSpyObj('PhotoService', ['loadAlbumPhoto']);
    const loadAlbumPhotoSpy: any = photoService.loadAlbumPhoto.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        HttpClientTestingModule,
        MatDatepickerModule,
        FormsModule,
        MatIconModule,
        MatGridListModule,
        MatDividerModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderTestFactory,
            deps: [HttpClient],
            },
        }),
      ],
      declarations: [
        OperatorFilterPipe,
        PhotoSearchComponent,
      ],
      providers: [
        TranslateService,
        UIStatusService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: PhotoService, useValue: photoService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
