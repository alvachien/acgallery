import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'acgallery-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.less'],
  imports: [
    NzResultModule,
    NzButtonModule,
    TranslocoModule,
  ],
})
export class UnauthorizedComponent {}
