import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatPaginatorModule,
  MatTableModule, MatStepperModule, MatToolbarModule, MatChipsModule, MatCheckboxModule, MatRadioModule, MatProgressBarModule,
  MatIconModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PhotouploadComponent } from './photoupload.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService, AuthService, UserDetailService } from '../services';
import { UserAuthInfo } from '../model';

@Component({ selector: 'acgallery-album-detail', template: '' })
class AlbumDetailComponent {
  @Input()
  objAlbum: any;
  @Input()
  uiMode: any;
}
describe('PhotouploadComponent', () => {
  let component: PhotouploadComponent;
  let fixture: ComponentFixture<PhotouploadComponent>;

  beforeEach(async(() => {
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());
    const albumService: any = jasmine.createSpyObj('AlbumService', ['loadAlbums']);
    const loadAlbumsSpy: any = albumService.loadAlbums.and.returnValue(of([]));
    const photoService: any = jasmine.createSpyObj('PhotoService', ['loadAlbumPhoto']);
    const loadAlbumPhotoSpy: any = photoService.loadAlbumPhoto.and.returnValue(of([]));
    const userDetailSrv = jasmine.createSpyObj('UserDetailService', ['readDetailInfo']);
    const readDetailInfoSpy = userDetailSrv.readDetailInfo.and.returnValue(of({}));
    userDetailSrv.UserDetailInfo = {
      albumCreate: false,
      uploadFileMinSize: 100,
      uploadFileMaxSize: 1000,
    };

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatTableModule,
        MatToolbarModule,
        MatStepperModule,
        MatChipsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatRadioModule,
        MatProgressBarModule,
        BrowserAnimationsModule,
        MatIconModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        ReactiveFormsModule,
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
        AlbumDetailComponent,
        PhotouploadComponent,
      ],
      providers: [
        TranslateService,
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceStub },
        { provide: AlbumService, useValue: albumService },
        { provide: PhotoService, useValue: photoService },
        { provide: UserDetailService, useValue: userDetailSrv },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotouploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
