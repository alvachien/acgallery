import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingDependsModule, getTranslocoModule } from 'src/testing/';
import { AlbumListComponent } from './album-list.component';
import { OdataService } from 'src/app/services';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        getTranslocoModule(),
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
