import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OdataService } from 'src/app/services';

@Component({
  selector: 'album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.less']
})
export class AlbumDetailComponent implements OnInit {

  constructor(private odataSvc: OdataService,
    public _router: Router) { }

  ngOnInit(): void {
  }

  public onSave(): void {    
  }
}
