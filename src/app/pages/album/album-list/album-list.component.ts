import { Component, OnInit } from '@angular/core';

import { OdataService } from 'src/app/services';

@Component({
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.less'],
})
export class AlbumListComponent implements OnInit {

  constructor(private odataSvc: OdataService ) { }

  ngOnInit(): void {
    this.odataSvc.getAlbums().subscribe({
      next: val => {
        console.log(val);
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
