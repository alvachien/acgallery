import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';

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

  constructor(private _translateService: TranslateService) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
    }
    
    this.initLang();
  }

  // Handlers
  onLogin() : void {
  }
  onLogout() : void {    
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
