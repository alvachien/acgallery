import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: boolean;
  public titleLogin: string;
  public arLangs: Array<AppLang>;
  public curLang: string = "";

  constructor(private _translateService: TranslateService,
    private _authService: AuthService) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
    }
    
    this.initLang();

    // Register the Auth service
    this._authService.authContent.subscribe(x => {
      // this._uistatus.setIsLogin(x.isAuthorized);
      // if (x.isAuthorized) {
      //   this.titleLogin = x.getUserName();
      //   this._uistatus.setTitleLogin(x.getUserName());
      // }
    }, error => {
      // Error occurred
    }, () => {
      // Completed
    });
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
    this.curLang = "zh";

    this._translateService.addLangs(["en", "zh"]);
    this._translateService.setDefaultLang(this.curLang);
  }
}
