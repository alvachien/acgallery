import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotochangeComponent } from './photochange.component';

describe('PhotochangeComponent', () => {
  let component: PhotochangeComponent;
  let fixture: ComponentFixture<PhotochangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotochangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotochangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
