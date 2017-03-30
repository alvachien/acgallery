import {
  Component, OnInit, OnDestroy, AfterViewInit, NgZone,
  EventEmitter, Input, Output, ViewContainerRef
} from '@angular/core';
import { UIMode } from '../model/common';
import { Album } from '../model/album';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Http, Headers, Response, RequestOptions,
  URLSearchParams
} from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'acgallery-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  private objAlbum: Album = null;
  private uiMode: UIMode = UIMode.Display;
  private currentMode: string;
  private routerID: number;

  constructor(private _http: Http,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _zone: NgZone,
    private authService: AuthService) { 
    this.objAlbum = new Album();
  }

  ngOnInit() {
    if (environment.DebugLogging) {
      console.log("Entering ngOnInit of AlbumComponent");
    }

    // Distinguish current mode
    this._activateRoute.url.subscribe(x => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === "create") {
          this.currentMode = "Create";
          this.objAlbum = new Album();
          this.uiMode = UIMode.Create;
        } else if (x[0].path === "edit") {
          this.routerID = +x[1].path;

          this.currentMode = "Edit"
          this.uiMode = UIMode.Change;
        } else if (x[0].path === "display") {
          this.routerID = +x[1].path;

          this.currentMode = "Display";
          this.uiMode = UIMode.Display;
        }
      }

      if (this.uiMode === UIMode.Display || this.uiMode === UIMode.Change) {
        // Load the account
        //this.readAccount();
      }
    }, error => {
      // this._dialogService.openAlert({
      //   message: error,
      //   disableClose: false, // defaults to false
      //   viewContainerRef: this._viewContainerRef, //OPTIONAL
      //   title: "Error", //OPTIONAL, hides if not provided
      //   closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
      // });
    }, () => {
      // Completed
    });
  }

  public needShowAccessCode(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }
}
