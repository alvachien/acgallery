import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
