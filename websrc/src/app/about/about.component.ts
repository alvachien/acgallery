import { Component, OnInit } from '@angular/core';
import { CreditsComponent }  from '../model/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  credits: Array<CreditsComponent>;

  constructor() { 
    this.credits = new Array<CreditsComponent>();

    let cc = new CreditsComponent();
    cc.Name = "Angular 2";
    cc.Version = "2.0";
    cc.Homepage = "https://www.angular.io";
    cc.GithubRepo = "https://github.com/angular/angular";
    this.credits.push(cc);

    cc = new CreditsComponent();
    cc.Name = "Covalent";
    cc.Version = "0";
    cc.Homepage = "https://teradata.github.io";
    cc.GithubRepo = "https://github.com/teradata/covalent"; 
    this.credits.push(cc);
    

  }

  ngOnInit() {
  }

}
