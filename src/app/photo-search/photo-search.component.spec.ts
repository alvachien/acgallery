import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSearchComponent } from './photo-search.component';

describe('PhotoSearchComponent', () => {
  let component: PhotoSearchComponent;
  let fixture: ComponentFixture<PhotoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoSearchComponent ]
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
