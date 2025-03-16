import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'acgallery-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
  imports: [
    NzPageHeaderModule,
    TranslocoModule,
  ]
})
export class AboutComponent implements OnInit {
  public currentVersion = '';
  public currentReleaseDate = '';

  ngOnInit(): void {
    this.currentVersion = environment.currentVersion;
    this.currentReleaseDate = environment.currentReleaseDate;
  }
}
