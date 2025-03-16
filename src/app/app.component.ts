import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzBreakpointService, siderResponsiveMap } from 'ng-zorro-antd/core/services';
import { Platform } from '@angular/cdk/platform';

import { environment } from '../environments/environment';
import { AuthService } from './services';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NzLayoutModule,
    NzSpaceModule,
    NzIconModule,
    NzMenuModule,
    RouterModule,
    NzDropDownModule,
    TranslocoModule,
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  visibleMenuLangLabel = true;
  visibleMenuUserLabel = true;
  visibleVersionLabel = true;
  collpasedWidth = 48;
  currentYear = new Date().getFullYear();
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
