import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { en_US, NzI18nService, zh_CN, } from 'ng-zorro-antd/i18n';

import { environment } from 'src/environments/environment';
import { AuthService } from './services';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private tranService: TranslocoService,
    private i18n: NzI18nService,
    private router: Router,
    private authService: AuthService) {
  }

  get currentVersion(): string {
    return environment.currentVersion;
  }

  onSetLanguage(lang: string) {
    if ((lang === 'en' || lang === 'zh') && this.tranService.getActiveLang() !== lang) {
      this.tranService.setActiveLang(lang);
      if (lang === 'zh') {
        this.i18n.setLocale(zh_CN);
      } else if(lang === 'en') {
        this.i18n.setLocale(en_US);
      }
    }
  }

  onOpenGithub(): void {
    window.open('https://www.github.com/alvachien/acgallery', '_blank');
  }
  onLogin(): void {
    if (this.authService.authSubject.getValue().isAuthorized) {
      this.onUserDetail();
    } else {
      this.authService.doLogin();
    }
  }

  onUserDetail(): void {
    this.router.navigate(['/userdetail/display']);
  }
}
