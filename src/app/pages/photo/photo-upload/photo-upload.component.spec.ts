import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { SequenceList } from 'actslib';
import { of } from 'rxjs';
import { Album } from 'src/app/models';
import { OdataService } from 'src/app/services';

import { TestingDependsModule, getTranslocoModule, asyncData } from 'src/testing/';
import { PhotoUploadComponent } from './photo-upload.component';

describe('PhotoUploadComponent', () => {
  let component: PhotoUploadComponent;
  let fixture: ComponentFixture<PhotoUploadComponent>;
  let odataService: any;
  let getAlbumsSpy: any;

  beforeAll(() => {
    odataService = jasmine.createSpyObj('OdataService', [
      'getAlbums',
    ]);
    getAlbumsSpy = odataService.getAlbums.and.returnValue(of([]));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        getTranslocoModule(),
      ],
      declarations: [ PhotoUploadComponent ],
      providers: [
        { provide: OdataService, useValue: odataService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('work with data', () => {
    let albums: {totalCount: number, items: SequenceList<Album>};
    beforeEach(() => {
      albums = {
        totalCount: 2,
        items: new SequenceList()
      };
      let nalbum:Album = new Album();
      nalbum.Id = 2;
      nalbum.Title = 'test2';
      albums.items.AppendElement(nalbum);
      nalbum = new Album();
      nalbum.Id = 3;
      nalbum.Title = 'test3';
      albums.items.AppendElement(nalbum);

      getAlbumsSpy.and.returnValue(asyncData(albums));
    });
    it('work with data', fakeAsync(() => {
      fixture.detectChanges(); // OnInit
      tick();
      fixture.detectChanges(); // Get Albums
      tick();
      fixture.detectChanges();

      expect(component).toBeTruthy();
      //expect(component.listOfAlbums.length).toEqual(2);
      expect(component.currentStep).toEqual(0);
      let nextButton = component.nextButtonEnabled;
      expect(nextButton).toBeFalse();

      flush();
    }));
  });
});

