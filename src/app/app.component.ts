import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzBreakpointService, siderResponsiveMap } from 'ng-zorro-antd/core/services';
import { Platform } from '@angular/cdk/platform';

import { environment } from 'src/environments/environment';
import { AuthService } from './services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  visibleMenuLangLabel = true;
  visibleMenuUserLabel = true;
  visibleVersionLabel = true;
  collpasedWidth = 48;
  private destroy$ = new Subject();

  constructor(
    private tranService: TranslocoService,
    private i18n: NzI18nService,
    private router: Router,
    private authService: AuthService,
    private platform: Platform,
    private bpObserver: NzBreakpointService
  ) {}

  get currentVersion(): string {
    return environment.currentVersion;
  }
  get isLoggedIn(): boolean {
    return this.authService.authSubject.getValue().isAuthorized;
  }
  get logoIcon(): string {
    return `${environment.AppHost}/assets/acgallery.ico`;
  }

  ngOnInit(): void {
    // File: ng-zorro-antd/sider.component.ts
    // if (this.platform.isBrowser) {
    //   this.breakpointService
    //     .subscribe(siderResponsiveMap, true)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(map => {
    //       const breakpoint = this.nzBreakpoint;
    //       if (breakpoint) {
    //         inNextTick().subscribe(() => {
    //           this.matchBreakPoint = !map[breakpoint];
    //           this.setCollapsed(this.matchBreakPoint);
    //           this.cdr.markForCheck(); // CDR: ChangeDetectRef
    //         });
    //       }
    //     });
    // }

    if (this.platform.isBrowser) {
      this.bpObserver
        .subscribe(siderResponsiveMap, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe((map) => {
          if (map.md) {
            this.visibleMenuLangLabel = true;
            this.visibleMenuUserLabel = true;
            this.visibleVersionLabel = true;
            this.collpasedWidth = 48;
          } else if (map.sm || map.xs) {
            this.visibleMenuLangLabel = false;
            this.visibleMenuUserLabel = false;
            this.visibleVersionLabel = false;
            this.collpasedWidth = 0;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  onSetLanguage(lang: string) {
    if ((lang === 'en' || lang === 'zh') && this.tranService.getActiveLang() !== lang) {
      this.tranService.setActiveLang(lang);
      if (lang === 'zh') {
        this.i18n.setLocale(zh_CN);
      } else if (lang === 'en') {
        this.i18n.setLocale(en_US);
      }
    }
  }

  onOpenGithub(): void {
    window.open('https://www.github.com/alvachien/acgallery', '_blank');
  }
  onLogin(): void {
    this.authService.doLogin();
  }
  onLogout(): void {
    this.authService.doLogout();
  }
  onUserDetail(): void {
    this.router.navigate(['/userdetail/display']);
  }
}
