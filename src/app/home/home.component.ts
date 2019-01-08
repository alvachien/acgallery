import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../services';
import { LogLevel } from '../model';

@Component({
  selector: 'acgallery-home',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css'],
})
export class HomeComponent implements OnInit {
  private _isLogin: boolean = false;
  public btnLoginTxt = '';
  public amtAlbum: number;
  public amtPhoto: number;

  constructor(private _authService: AuthService,
    private _router: Router,
    private _http: HttpClient,
    private _zone: NgZone) {
    this._authService.authContent.subscribe((x: any) => {
      this._zone.run(() => {
        this._isLogin = x.isAuthorized;
        if (x.isAuthorized) {
          this.btnLoginTxt = 'Login.UserDetail';
        } else {
          this.btnLoginTxt = 'Login.Login';
        }
      });
    }, (error: any) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error('ACGallery [Error]: Failed in subscribe to User', error);
      }
    }, () => {
      // Completed
    });

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    this._http.get(environment.StatisticsAPIUrl, {headers: headers}).subscribe((x: any) => {
      this.amtAlbum = x.albumAmount;
      this.amtPhoto = x.photoAmount;
    });
  }

  ngOnInit(): void {
    
  }

  onLogin(): void {
    if (this._isLogin) {
      this.onUserDetail();
    } else {
      this._authService.doLogin();
    }
  }

  onUserDetail(): void {
    this._router.navigate(['/userdetail']);
  }
}
