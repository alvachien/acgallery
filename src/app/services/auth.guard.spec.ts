import { TestBed } from '@angular/core/testing';

import { TestingDependsModule, getTranslocoModule } from 'src/testing/';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingDependsModule,
        getTranslocoModule(),
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
