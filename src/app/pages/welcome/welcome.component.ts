import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConsoleLogTypeEnum, writeConsole } from "src/app/models";

import { OdataService } from "src/app/services";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  statInfo: any = {
    photoAmount: 0,
    albumAmount: 0,
    photoAmountInTop5Album: [],
    photoAmountInTop5Tag: {},
  };
  constructor(private odataSvc: OdataService, private router: Router) {}

  ngOnInit() {
    this.odataSvc.getStatistics().subscribe({
      next: (val) => {
        this.statInfo.photoAmount = val.photoAmount;
        this.statInfo.albumAmount = val.albumAmount;
      },
      error: (err) => {
        writeConsole(
          `ACGallery [Error]: Entering WelcomePage ngOnInit getStatistics ${err.toString()}`,
          ConsoleLogTypeEnum.error
        );
      },
    });
  }
  public onNavigateToPhoto() {
    this.router.navigate(["photo"]);
  }
  public onNavigateToAlbum() {
    this.router.navigate(["album"]);
  }
}
