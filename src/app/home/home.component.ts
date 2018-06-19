import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services';
import { LogLevel } from '../model';

@Component({
  selector: 'acgallery-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public btnLoginTxt = '';
  private _isLogin: boolean = false;

  constructor(private _authService: AuthService,
    private _router: Router,
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
