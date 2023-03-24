import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Album, ConsoleLogTypeEnum, writeConsole } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.less'],
})
export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  totalCount = 0;
  pageIndex = 1;
  sizePerPage = 10;

  constructor(private odataSvc: OdataService, private router: Router) {}

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
