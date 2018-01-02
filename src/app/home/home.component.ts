import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services';
import { LogLevel } from '../model';

@Component({
  selector: 'acgallery-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public btnLoginTxt = '';

  constructor(private _authService: AuthService,
    private _zone: NgZone) {
    this._authService.authContent.subscribe(x => {
      this._zone.run(() => {
        if (x.isAuthorized) {
          this.btnLoginTxt = 'Login.UserDetail';
        } else {
          this.btnLoginTxt = 'Login.Login';
        }
      });
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error('ACGallery [Error]: Failed in subscribe to User', error);
      }
    }, () => {
      // Completed
    });
  }

  ngOnInit() {
  }
}
