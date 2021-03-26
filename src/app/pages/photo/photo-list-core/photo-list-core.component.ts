import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Photo } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'acgallery-photo-list-core',
  templateUrl: './photo-list-core.component.html',
  styleUrls: ['./photo-list-core.component.less'],
})
export class PhotoListCoreComponent implements OnInit {
  @Input()
  totalCount = 0;
  viewMode = 'std';
  pageSize = 20;
  pageIndex = 1;
  @Input()
  photos: Photo[] = [];
  @Output()
  paginationEvent = new EventEmitter<{pageSize: number, pageIndex: number}>();

  constructor(public odataSvc: OdataService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }

  // Command handlers
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
    console.log("Photo List Core: Entering onPageIndexChanged");
    this.paginationEvent.emit({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
    });
    // this.odataSvc.getPhotos((pgIdx - 1) * 20, 20).subscribe({
    //   next: val => {
    //     // console.log(val);
    //     this.totalCount = val.totalCount;
    //     this.photos = [];
    //     for(let i = 0; i < val.items.Length(); i++) {
    //       this.photos.push(val.items.GetElement(i));
    //     }
    //   },
    //   error: err => {
    //     console.error(err);
    //   }
    // });
  }
}
