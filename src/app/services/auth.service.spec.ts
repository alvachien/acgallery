import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let securService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let checkAuthSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let registerForEventsSpy: any;

  beforeAll(() => {
    securService = jasmine.createSpyObj('OidcSecurityService', ['checkAuth']);
    checkAuthSpy = securService.checkAuth.and.returnValue(of({}));

    eventService = jasmine.createSpyObj('PublicEventsService', ['registerForEvents']);
    registerForEventsSpy = eventService.registerForEvents.and.returnValue(of({}));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: OidcSecurityService, useValue: securService },
        { provide: PublicEventsService, useValue: eventService },
      ],
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
