import { Component, OnInit } from '@angular/core';

import { AppCredits } from '../../models';

@Component({
  selector: 'acgallery-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.less'],
})
export class CreditsComponent  {

  credits: AppCredits[] = [];

  constructor() {
    this.credits.push({name: '.NET Core',     link: 'https://dot.net' });
    this.credits.push({name: 'Angular',       link: 'https://angular.io' });
    this.credits.push({name: 'Ant Design',    link: 'https://ng.ant.design' });
    this.credits.push({name: 'Typescript',    link: 'https://typescriptlang.org' });
    // this.credits.push({name: 'EXIF Tools',    link: 'http://www.sno.phy.queensu.ca/~phil/exiftool' });
    this.credits.push({name: 'Magick.NET',    link: 'https://www.imagemagick.org/' });
  }
}
