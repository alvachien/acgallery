import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { LogLevel, AppLang } from './model/common';
import { environment } from '../environments/environment';
import { AuthService, UIStatusService } from './services';
import { Observable } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

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
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private _translateService: TranslateService,
    private _authService: AuthService,
    private _uistatusService: UIStatusService,
    private _http: HttpClient,
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Enter constructor of AppComponent');
    }
    this.mobileQuery = _media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.initLang();

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');

    this._http.get(environment.WakeupAPIUrl, { headers: headers })
      .subscribe(x => {
        // Do nothing, just wakeup the API.
      });

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
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
