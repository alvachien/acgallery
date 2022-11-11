import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OdataService } from 'src/app/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  statInfo: any = {
    photoAmount: 0,
    albumAmount: 0,
    photoAmountInTop5Album: [],
    photoAmountInTop5Tag: {}
  };
  constructor(private odataSvc: OdataService,
    private router: Router) { }

  ngOnInit() {
    this.odataSvc.getMetadata().subscribe({
      next: val => console.log(val),
      error: err => console.error(err),
    });

    this.odataSvc.getStatistics().subscribe({
      next: val => {
        this.statInfo.photoAmount = val.photoAmount;
        this.statInfo.albumAmount = val.albumAmount;
      },
      error: err => console.error(err),
    });
  }
  public onNavigateToPhoto() {
    this.router.navigate(['photo']);
  }
  public onNavigateToAlbum() {
    this.router.navigate(['album']);
  }
}
