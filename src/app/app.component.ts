import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';
import { AuthService, UIStatusService } from './services';
import { Observable, Subscription } from 'rxjs';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean;
  public titleLogin: string;
  public arLangs: Array<AppLang>;
  public selectedLanguage = '';
  @ViewChild('pswp') elemPSWP;
  private _watcherMedia: Subscription;
  public isXSScreen = false;
  public sidenavMode: string;

  constructor(private _translateService: TranslateService,
    private _authService: AuthService,
    private _uistatusService: UIStatusService,
    private _http: HttpClient,
    private _zone: NgZone,
    private _media: ObservableMedia) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Enter constructor of AppComponent');
    }

    this._watcherMedia = this._media.subscribe((change: MediaChange) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of AppComponent: ${change.mqAlias} = (${change.mediaQuery})`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change.mqAlias === 'xs') {
        this.isXSScreen = true;
        this.sidenavMode = 'over';
      } else {
        this.isXSScreen = false;
        this.sidenavMode = 'side';
      }
    });

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
  }

  ngOnInit(): void {
    if (this.elemPSWP) {
      this._uistatusService.elemPSWP = this.elemPSWP.nativeElement;
    }
  }

  ngOnDestroy(): void {
    this._watcherMedia.unsubscribe();
  }

  // Handlers
  onLogon(): void {
    this._authService.doLogin();
  }

  onLogout(): void {
    this._authService.doLogout();
  }

  onLanguageChanged(lang: string): void {
    if (lang !== this._translateService.currentLang) {
      this.selectedLanguage = lang;
      this._translateService.setDefaultLang(this.selectedLanguage);
    }
  }

  onUserDetail(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Enter onUserDetail of AppComponent, prepare navigation...');
    }
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
    this.selectedLanguage = 'en'; // Default language

    this._translateService.addLangs(['en', 'zh']);
    this._translateService.setDefaultLang(this.selectedLanguage);
  }

  public onOpenMathExcises() {
    window.open(environment.AppMathExercise, '_blank');
  }
  public onOpenHIH() {
    window.open(environment.AppHIH, '_blank');
  }
}
