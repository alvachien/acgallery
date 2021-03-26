import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Photo } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.less'],
})
export class PhotoListComponent implements OnInit {
  totalCount = 0;
  viewMode = 'std';
  pageIndex = 1;
  photos: Photo[] = [];

  constructor(public odataSvc: OdataService, 
    private router: Router) { }

  ngOnInit(): void {
    this.onFetchData(20, 0);
    // this.odataSvc.getPhotos().subscribe({
    //   next: val => {
    //     // console.log(val);
    //     this.totalCount = val.totalCount;
    //     for(let i = 0; i < val.items.Length(); i++) {
    //       this.photos.push(val.items.GetElement(i));
    //     }
    //   },
    //   error: err => {
    //     console.error(err);
    //   }
    // });
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

  onFetchData(top, skip): void {
    this.odataSvc.getPhotos(skip, top).subscribe({
      next: val => {
        // console.log(val);
        this.totalCount = val.totalCount;
        this.photos = [];
        for(let i = 0; i < val.items.Length(); i++) {
          this.photos.push(val.items.GetElement(i));
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }
  onPaginationEvent(pgInfo: any) {
    // Get the results based on pagination info.
    const top = pgInfo.pageSize;
    const skip = pgInfo.pageSize * (pgInfo.pageIndex - 1);
    this.onFetchData(top, skip);
  }
}
