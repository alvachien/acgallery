import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoListCoreComponent } from './photo-list-core.component';

describe('PhotoListCoreComponent', () => {
  let component: PhotoListCoreComponent;
  let fixture: ComponentFixture<PhotoListCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoListCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoListCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
