import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatPaginatorModule,
  MatIconModule, MatChipsModule, MatSnackBarModule, MatDialogModule,
 } from '@angular/material';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhotolistComponent } from './photolist.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService } from '../services';
import { UserAuthInfo } from '../model';

describe('PhotolistComponent', () => {
  let component: PhotolistComponent;
  let fixture: ComponentFixture<PhotolistComponent>;

  beforeEach(async(() => {
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub: any = new ActivatedRouteUrlStub([new UrlSegment('createbrwfrm', {})] as UrlSegment[]);
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const photoService: any = jasmine.createSpyObj('PhotoService', ['loadPhotos']);
    const loadPhotosSpy: any = photoService.loadPhotos.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatMenuModule,
        MatGridListModule,
        MatIconModule,
        MatChipsModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatDialogModule,
        TranslateModule.forRoot({
            loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderTestFactory,
            deps: [HttpClient],
            },
        }),
      ],
      declarations: [
        PhotolistComponent,
      ],
      providers: [
        TranslateService,
        UIStatusService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: PhotoService, useValue: photoService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
