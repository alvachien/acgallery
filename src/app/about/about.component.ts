import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel } from '../model';

@Component({
  selector: 'acgallery-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  public currentVersion: string;
  public currentReleaseDate: string;

  constructor() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering AboutComponent constructor');
    }

    this.currentVersion = environment.CurrentVersion;
    this.currentReleaseDate = environment.CurrentReleaseDate;
  }
}
