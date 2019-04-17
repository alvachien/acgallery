import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { LogLevel, AppLang } from './model/common';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService, UIStatusService, UserDetailService } from './services';
import { Observable, Subscription, ReplaySubject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _watcherMedia: Subscription;
  private _destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public isLoggedIn: boolean;
  public titleLogin: string;
  public arLangs: AppLang[];
  public selectedLanguage = '';
  @ViewChild('pswp') elemPSWP;
  public isXSScreen = false;
  public sidenavMode: string;
  get currentVersion(): string {
    return environment.CurrentVersion;
  }

  constructor(private _translateService: TranslateService,
    private _authService: AuthService,
    private _uistatusService: UIStatusService,
    private _usrdetailService: UserDetailService,
    private _zone: NgZone,
    private _router: Router,
    private _media: MediaObserver) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AppComponent constructor');
    }

    this._watcherMedia = this._media.asObservable()
      .pipe(takeUntil(this._destroyed$))
      .subscribe((change: MediaChange[]) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of AppComponent: ${change[0].mqAlias} = (${change[0].mediaQuery})`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change[0].mqAlias === 'xs') {
        this.isXSScreen = true;
        this.sidenavMode = 'over';
      } else {
        this.isXSScreen = false;
        this.sidenavMode = 'side';
      }
    });

    this.initLang();

    // Register the Auth service
    this._authService.authSubject.pipe(takeUntil(this._destroyed$)).subscribe((x: any) => {
      this._zone.run(() => {
        this.isLoggedIn = x.isAuthorized;
        if (this.isLoggedIn) {
          this.titleLogin = x.getUserName();

          this._usrdetailService.readDetailInfo().pipe(takeUntil(this._destroyed$)).subscribe((detail: any) => {
            // Do nothing
            if (detail && detail.displayAs) {
              this.titleLogin = detail.displayAs;
            }
          }, (error: any) => {
            if (environment.LoggingLevel >= LogLevel.Error) {
              console.error('ACGallery [Error]: Failed in read user detail', error);
            }
          }, () => {
            if (this._usrdetailService.InfoLoaded) {
              // Detail info. exists
            } else {
              // Navigate to the user detail
              this.onUserDetail();
            }
          });
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
    if (this.elemPSWP) {
      this._uistatusService.elemPSWP = this.elemPSWP.nativeElement;
    }
  }

  ngOnDestroy(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AppComponent ngOnDestroy...');
    }
    if (this._watcherMedia) {
      this._watcherMedia.unsubscribe();
    }

    this._destroyed$.next(true);
    this._destroyed$.complete();
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

    this._router.navigate(['/userdetail']);
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
