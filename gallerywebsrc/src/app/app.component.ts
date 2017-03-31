import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { UIStatusService } from './services/uistatus.service';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  public titleLogin: string;
  public arLangs: Array<AppLang>;
  public curLang: string = "";
  @ViewChild('pswp') elemPSWP;

  constructor(private _translateService: TranslateService,
    private _authService: AuthService,
    private _uistatusService: UIStatusService,
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
        console.error("ACGallery Log [Error]: Failed in subscribe to User", error);
      }
    }, () => {
      // Completed
    });
  }

  ngOnInit() : void {
    if (this.elemPSWP) {
      this._uistatusService.elemPSWP = this.elemPSWP;
    }
  }

  // Handlers
  onLogin() : void {
    this._authService.doLogin();
  }
  
  onLogout() : void {
    this._authService.doLogout();
  } 

  onCurLanguageChanged($event): void {
    if (this.curLang !== this._translateService.currentLang) {
      this._translateService.setDefaultLang(this.curLang);
    }
  } 

  // Implemented method
  initLang() : void {
    this.arLangs = new Array<AppLang>();
    let lo: AppLang = new AppLang();
    lo.Value = "en";
    lo.DisplayString = "Language.English";
    this.arLangs.push(lo);
    lo = new AppLang();
    lo.Value = "zh";
    lo.DisplayString = "Language.SimpChinese";
    this.arLangs.push(lo);
    this.curLang = "en"; // Default language 

    this._translateService.addLangs(["en", "zh"]);
    this._translateService.setDefaultLang(this.curLang);
  }
}
