import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [
    WelcomeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    NzGridModule,
    NzStatisticModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzCardModule,
  ],
  declarations: [
    WelcomeComponent
  ],
  exports: [
    WelcomeComponent
  ],
})
export class WelcomeModule { }
