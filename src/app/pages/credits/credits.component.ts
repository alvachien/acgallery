import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acgallery-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.less'],
})
export class CreditsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onBack(): void {
    console.log('onBack');
  }
}
