
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsTableComponent } from './credits-table.component';

describe('CreditsTableComponent', () => {
  let component: CreditsTableComponent;
  let fixture: ComponentFixture<CreditsTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
