import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { UnauthorizedRoutingModule } from './unauthorized-routing.module';
import { UnauthorizedComponent } from './unauthorized.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    UnauthorizedRoutingModule,
    NzResultModule,
    TranslocoModule,
  ]
})
export class UnauthorizedModule { }
