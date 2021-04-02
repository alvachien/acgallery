import { Component, OnInit } from '@angular/core';
import { OdataService } from 'src/app/services';

@Component({
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
  constructor(private odataSvc: OdataService) { }

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
}
