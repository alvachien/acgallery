import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'acgallery-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  public currentVersion: string;
  public currentReleaseDate: string;

  constructor() {
    this.currentVersion = environment.CurrentVersion;
    this.currentReleaseDate = environment.CurrentReleaseDate;
  }

  ngOnInit() {
  }
}
