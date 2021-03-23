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
    this.onPageIndexChanged(1);
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
  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }

  onChangePhoto(pht: Photo): void {
    // Show the dialog
  }
  onDeletePhoto(pht: Photo): void {
    // Delete    
    this.odataSvc.deletePhoto(pht.photoId).subscribe({
      next: val => {
        let pidx = this.photos.findIndex(pt => pt.photoId === pht.photoId);
        if (pidx !== -1) {
          this.photos.splice(pidx, 1);
        }
        this.totalCount --;
      },
      error: err => {
        console.error(err);
      }
    })
  }
  onPageIndexChanged(pgIdx: number): void {
    console.log("Photo List page: Entering onPageIndexChanged");
    this.odataSvc.getPhotos((pgIdx - 1) * 20, 20).subscribe({
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
}
