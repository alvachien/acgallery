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
  photos: Photo[] = [];

  constructor(public odataSvc: OdataService, 
    private router: Router) { }

  ngOnInit(): void {
    this.odataSvc.getPhotos().subscribe({
      next: val => {
        // console.log(val);
        this.totalCount = val.totalCount;
        for(let i = 0; i < val.items.Length(); i++) {
          this.photos.push(val.items.GetElement(i));
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onUpload(): void {
    this.router.navigate(['/photo/upload']);
  }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }
}
