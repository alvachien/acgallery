import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';
import { AuthService, AlbumService, UIStatusService } from './services';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  public titleLogin: string;
  public arLangs: Array<AppLang>;
  public curLang = '';
  @ViewChild('pswp') elemPSWP;

  constructor(private _translateService: TranslateService,
    private _authService: AuthService,
    private _uistatusService: UIStatusService,
    private _albumService: AlbumService,
    private _zone: NgZone) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
    }

    this.initLang();

    // Register the Auth service
    this._authService.authContent.subscribe(x => {
      this._zone.run(() => {
        this.isLoggedIn = x.isAuthorized;
        if (this.isLoggedIn) {
          this.titleLogin = x.getUserName();
        }
      });
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error('ACGallery [Error]: Failed in subscribe to User', error);
      }
    }, () => {
      // Completed
    });

    // Try to wakeup the WebAPI
    this._albumService.loadAlbums().subscribe(x => {
      // Do nothing here!!!
    });
  }

  ngOnInit(): void {
    if (this.elemPSWP) {
      this._uistatusService.elemPSWP = this.elemPSWP.nativeElement;
    }    
  }

  // Handlers
  onLogin(): void {
    this._authService.doLogin();
  }

  onLogout(): void {
    this._authService.doLogout();
  }

  onCurLanguageChanged(): void {
    if (this.curLang !== this._translateService.currentLang) {
      this._translateService.setDefaultLang(this.curLang);
    }
  }

  onUserDetail(): void {
    
  }

  // Implemented method
  initLang(): void {
    this.arLangs = new Array<AppLang>();
    let lo: AppLang = new AppLang();
    lo.Value = 'en';
    lo.DisplayString = 'Language.English';
    this.arLangs.push(lo);
    lo = new AppLang();
    lo.Value = 'zh';
    lo.DisplayString = 'Language.SimpChinese';
    this.arLangs.push(lo);
    this.curLang = 'en'; // Default language

    this._translateService.addLangs(['en', 'zh']);
    this._translateService.setDefaultLang(this.curLang);
  }
}
