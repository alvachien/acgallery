import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { TranslocoModule } from '@jsverse/transloco';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

import { Album, ConsoleLogTypeEnum, writeConsole } from '../../../models';
import { OdataService } from '../../../services';
import { environment } from '../../../../environments/environment.development';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.less'],
  imports: [
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzListModule,
    TranslocoModule,
    NzPaginationModule,
    NzDividerModule,
    NzBadgeModule,
  ]
})
export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  totalCount = 0;
  pageIndex = 1;
  sizePerPage = 10;

  readonly odataSvc = inject(OdataService);
  readonly router = inject(Router);
  
  constructor() {}

  ngOnInit(): void {
    this.onPageIndexChanged(1);
  }

  get greyJpg(): string {
    return `${environment.AppHost}/assets/img/grey.jpg`;
  }

  onCreate(): void {
    // Create ablum coming from upload.
    this.router.navigate(['/photo/upload']);
  }
  onDisplay(instance: Album): void {
    this.router.navigate(['/album/display', instance.Id]);
  }
  onEdit(instance: Album): void {
    this.router.navigate(['/album/change', instance.Id]);
  }
  onRefresh(): void {
    // TBD. refresh the list
  }
  onPageIndexChanged(pgIdx: number): void {
    this.odataSvc.getAlbums((pgIdx - 1) * this.sizePerPage, this.sizePerPage).subscribe({
      next: (val) => {
        this.totalCount = val.totalCount;
        this.albums = []; // Clear it before assign.
        for (let i = 0; i < val.items.Length(); i++) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.albums.push(val.items.GetElement(i)!);
        }
      },
      error: (err) => {
        writeConsole(
          `ACGallery [Error]: Entering AlbumListComponent onPageIndexChanged ${err.toString()}`,
          ConsoleLogTypeEnum.error
        );
      },
    });
  }
}
