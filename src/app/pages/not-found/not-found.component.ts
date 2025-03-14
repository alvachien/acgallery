import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less'],
  imports: [
    NzResultModule,
    TranslocoModule,
  ]
})
export class NotFoundComponent {}
