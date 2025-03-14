import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { DecimalPipe } from '@angular/common';

import { ConsoleLogTypeEnum, writeConsole } from '../../../app/models';
import { OdataService } from '../../../app/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [
    NzPageHeaderModule,
    NzBreadCrumbModule,
    TranslocoModule,
    NzGridModule,
    NzCardModule,
    NzStatisticModule,
    DecimalPipe
  ]
})
export class WelcomeComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statInfo: any = {
    photoAmount: 0,
    albumAmount: 0,
    photoAmountInTop5Album: [],
    photoAmountInTop5Tag: {},
  };
  constructor(private odataSvc: OdataService, private router: Router) {}

  ngOnInit() {
    this.odataSvc.getStatistics().subscribe({
      next: (val) => {
        this.statInfo.photoAmount = val.photoAmount;
        this.statInfo.albumAmount = val.albumAmount;
      },
      error: (err) => {
        writeConsole(
          `ACGallery [Error]: Entering WelcomePage ngOnInit getStatistics ${err.toString()}`,
          ConsoleLogTypeEnum.error
        );
      },
    });
  }
  public onNavigateToPhoto() {
    this.router.navigate(['photo']);
  }
  public onNavigateToAlbum() {
    this.router.navigate(['album']);
  }
}
