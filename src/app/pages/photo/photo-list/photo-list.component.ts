import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConsoleLogTypeEnum, Photo, writeConsole } from 'src/app/models';
import { OdataService } from 'src/app/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.less'],
})
export class PhotoListComponent implements OnInit {
  totalCount = 0;
  viewMode = 'std';
  pageSize = 20;

  photos: Photo[] = [];

  constructor(public odataSvc: OdataService, private router: Router) {}

  ngOnInit(): void {
    this.onFetchData(this.pageSize, 0);
  }

  onUpload(): void {
    this.router.navigate(['/photo/upload']);
  }
  onRefresh(): void {
    // TBD. Refresh
  }
  onSearch(): void {
    this.router.navigate(['/photo/search']);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFetchData(top: any, skip: any): void {
    this.odataSvc.getPhotos(skip, top).subscribe({
      next: (val) => {
        if (val && val.items) {
          this.totalCount = val.totalCount;
          this.photos = [];
          for (let i = 0; i < val.items.Length(); i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.photos.push(val.items.GetElement(i)!);
          }
        }
      },
      error: (err) => {
        writeConsole(
          `ACGallery [Error]: Entering PhotoListComponent onFetchData getPhotos: ${err.toString()}`,
          ConsoleLogTypeEnum.error
        );
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPaginationEvent(pgInfo: any) {
    // Get the results based on pagination info.
    const top = pgInfo.pageSize;
    const skip = pgInfo.pageSize * (pgInfo.pageIndex - 1);
    this.onFetchData(top, skip);
  }
}
