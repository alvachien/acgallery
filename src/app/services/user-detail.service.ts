import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserDetailService {
  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }
}
