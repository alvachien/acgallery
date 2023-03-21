import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'acgallery-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
})
export class AboutComponent implements OnInit {
  public currentVersion = '';
  public currentReleaseDate = '';

  ngOnInit(): void {
    this.currentVersion = environment.currentVersion;
    this.currentReleaseDate = environment.currentReleaseDate;
  }
}
