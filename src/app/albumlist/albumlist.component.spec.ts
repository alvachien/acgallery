import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumlistComponent } from './albumlist.component';

describe('AlbumlistComponent', () => {
  let component: AlbumlistComponent;
  let fixture: ComponentFixture<AlbumlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
