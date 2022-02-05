import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { NzImageService } from 'ng-zorro-antd/image';

import { Photo } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-photo-list-core',
  templateUrl: './photo-list-core.component.html',
  styleUrls: ['./photo-list-core.component.less'],
})
export class PhotoListCoreComponent {
  @Input() totalCount = 0;
  viewMode = 'std';
  @Input() pageSize = 20;
  pageIndex = 1;
  @Input() photos: Photo[] = [];
  @Output() paginationEvent = new EventEmitter<{pageSize: number, pageIndex: number}>();
  isExifVisible = false;
  curExif: any = {};

  constructor(public odataSvc: OdataService, 
    private nzImageService: NzImageService ) { }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.thumbnailFileUrl;
    return '';
  }

  // Command handlers
  onPhotoViewEXIF(pht: Photo): void {
    this.odataSvc.getPhotoEXIF(pht.photoId).subscribe({
      next: val => {
        this.curExif = val;
        this.isExifVisible = true;
      },
      error: err => {
        console.error(err);
      }
    });
  }
  handleExifDlgCancel() {
    this.isExifVisible = false;
  }
  handleExifDlgOk() {
    this.isExifVisible = false;
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
    console.log("Photo List Core: Entering onPageIndexChanged");
    this.paginationEvent.emit({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
    });
 }
  onStartPreview(phtid: string): void {
    console.log("Start preview");
    const idx = this.photos.findIndex(val => val.photoId === phtid);
    const images = [];
    if (idx >= 0) {
      let idx2 = idx;
      for(idx2 = idx; idx2 < this.photos.length; idx2 ++) {
        images.push({
          src: environment.apiRootUrl + 'PhotoFile/' + this.photos[idx2].fileUrl,
          width: this.photos[idx2].width + 'px',
          height: this.photos[idx2].height + 'px'
        });  
      }
    }
    if (idx > 0) {
      let idx3 = 0;
      for(; idx3 < idx; idx3 ++) {
        images.push({
          src: environment.apiRootUrl + 'PhotoFile/' + this.photos[idx3].fileUrl,
          width: this.photos[idx3].width + 'px',
          height: this.photos[idx3].height + 'px'
        });
      }
    }
    this.nzImageService.preview(images, { nzZoom: 1, nzRotate: 0 });
  }
}
