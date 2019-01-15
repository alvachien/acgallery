import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule, MatExpansionModule, MatDividerModule, MatButtonModule, MatMenuModule, 
  MatIconModule, MatPaginatorModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlbumComponent } from './album.component';
import { ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService } from '../services';
import { HttpLoaderTestFactory } from '../../testing';

@Component({ selector: 'acgallery-album-detail', template: '' })
class AlbumDetailComponent {
  @Input()
  objAlbum: any;
  @Input()
  uiMode: any;
}
describe('AlbumComponent', () => {
  let component: AlbumComponent;
  let fixture: ComponentFixture<AlbumComponent>;

  beforeEach(async(() => {
    const routerSpy: any = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub: any = new ActivatedRouteUrlStub([new UrlSegment('create', {})] as UrlSegment[]);
    const albumService: any = jasmine.createSpyObj('AlbumService', ['loadAlbum']);
    const loadAlbumSpy: any = albumService.loadAlbum.and.returnValue(of([]));
    const photoService: any = jasmine.createSpyObj('PhotoService', ['loadAlbumPhoto']);
    const loadAlbumPhotoSpy: any = photoService.loadAlbumPhoto.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
        MatExpansionModule,
        MatDividerModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatDialogModule,
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
        AlbumDetailComponent,
        AlbumComponent,
      ],
      providers: [
        TranslateService,
        UIStatusService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AlbumService, useValue: albumService },
        { provide: PhotoService, useValue: photoService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
