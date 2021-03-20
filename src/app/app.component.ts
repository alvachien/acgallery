import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'acgallery-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private tranService: TranslocoService,) {
  }

  get currentVersion(): string {
    return environment.currentVersion;
  }

  onSetLanguage(lang: string) {
    if ((lang === 'en' || lang === 'zh') && this.tranService.getActiveLang() !== lang) {
      this.tranService.setActiveLang(lang);
    }
  }
}
