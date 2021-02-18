import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AlbumListComponent } from './album-list.component';
import { OdataService } from 'src/app/services';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [
        AlbumListComponent,
      ],
      providers: [
        OdataService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
