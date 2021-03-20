import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Album } from 'src/app/models';
import { OdataService } from 'src/app/services';

@Component({
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.less'],
})
export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  totalCount = 0;
  pageIndex = 1;

  constructor(private odataSvc: OdataService,
    private router: Router) { }

  ngOnInit(): void {
    this.odataSvc.getAlbums().subscribe({
      next: val => {
        // console.log(val);
        this.totalCount = val.totalCount;
        for(let i = 0; i < val.items.Length(); i++) {
          this.albums.push(val.items.GetElement(i));
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/album/create']);
  }
  onDisplay(instance: Album): void {
    this.router.navigate(['/album/display', instance.Id]);
  }
  onEdit(instance: Album): void {
    this.router.navigate(['/album/change', instance.Id]);
  }
}
