import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AlbumService } from './album.service';
import { AuthService } from './auth.service';
import { UserAuthInfo } from '../model';

describe('AlbumService', () => {
  beforeEach(() => {
    const authServiceStub: Partial<AuthService> = {};
    authServiceStub.authSubject = new BehaviorSubject(new UserAuthInfo());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AlbumService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });
  });

  it('should create...', inject([AlbumService], (service: AlbumService) => {
    expect(service).toBeTruthy();
  }));
});
