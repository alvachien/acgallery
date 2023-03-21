import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { TestingDependsModule, getTranslocoModule, FakeDataHelper } from 'src/testing/';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let fakeData: FakeDataHelper;
  let guard: AuthGuard;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();
  });

  beforeEach(() => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(fakeData.currentUser!);

    TestBed.configureTestingModule({
      imports: [TestingDependsModule, getTranslocoModule()],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
