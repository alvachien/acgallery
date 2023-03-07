import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper } from 'src/testing/';
import { WelcomeComponent } from './';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let fakeData: FakeDataHelper;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();
  });

  beforeEach(async () => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);
    await TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        NzBreadCrumbModule,
        NzCardModule,
        NzPageHeaderModule,
        NzStatisticModule,
        getTranslocoModule(),
      ],
      declarations: [ WelcomeComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
