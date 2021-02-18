import { Component, OnInit } from '@angular/core';
import { OdataService } from 'src/app/services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {

  constructor(private odataSvc: OdataService) { }

  ngOnInit() {
    this.odataSvc.getMetadata().subscribe({
      next: val => console.log(val),
      error: err => console.error(err),
    });
  }
}
