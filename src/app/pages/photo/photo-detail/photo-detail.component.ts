import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.less'],
  imports: [
    NzPageHeaderModule,
    NzBreadCrumbModule,
    TranslocoModule,
  ]
})
export class PhotoDetailComponent {}
