import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { UserDetailService } from './user-detail.service';
import { AuthService } from './auth.service';
import { UserAuthInfo } from '../model';

describe('UserDetailService', () => {
  beforeEach(() => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        UserDetailService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });
  });

  it('should be created', inject([UserDetailService], (service: UserDetailService) => {
    expect(service).toBeTruthy();
  }));
});
