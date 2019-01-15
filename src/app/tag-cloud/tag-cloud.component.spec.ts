import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatCardModule, MatGridListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatPaginatorModule } from '@angular/material';
import { of } from 'rxjs';

import { TagCloudComponent } from './tag-cloud.component';
import { HttpLoaderTestFactory, ActivatedRouteUrlStub } from '../../testing';
import { AlbumService, PhotoService, UIStatusService } from '../services';

describe('TagCloudComponent', () => {
  let component: TagCloudComponent;
  let fixture: ComponentFixture<TagCloudComponent>;

  beforeEach(async(() => {
    const photoService: any = jasmine.createSpyObj('PhotoService', ['getTagCount']);
    const getTagCountSpy: any = photoService.getTagCount.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
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
        TagCloudComponent,
      ],
      providers: [
        TranslateService,
        { provide: PhotoService, useValue: photoService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
