
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDashboardComponent } from './page-dashboard.component';

describe('PageDashboardComponent', () => {
  let component: PageDashboardComponent;
  let fixture: ComponentFixture<PageDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
