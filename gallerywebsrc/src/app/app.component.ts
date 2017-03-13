import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LogLevel } from './model/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _translateService: TranslateService) {
    if (environment.LoggingLevel >= LogLevel.Debug) {

    }
    
    this._translateService.addLangs(["en", "zh"]);
    this._translateService.setDefaultLang('en');    
  }
}
