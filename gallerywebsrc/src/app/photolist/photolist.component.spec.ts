import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotolistComponent } from './photolist.component';

describe('PhotolistComponent', () => {
  let component: PhotolistComponent;
  let fixture: ComponentFixture<PhotolistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotolistComponent ]
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
