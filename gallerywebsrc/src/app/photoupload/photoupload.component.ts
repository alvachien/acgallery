import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'fine-uploader';
import { AuthService } from '../services/auth.service';
import { Album } from '../model/album';
import { Photo } from '../model/photo';

@Component({
  selector: 'acgallery-photoupload',
  templateUrl: './photoupload.component.html',
  styleUrls: ['./photoupload.component.css']
})
export class PhotouploadComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedFiles: any;
  public progressNum: number = 0;
  public isUploading: boolean = false;
  public photoMaxKBSize: number = 0;
  public photoMinKBSize: number = 0;
  //public arUpdPhotos: UpdPhoto[] = [];
  private uploader: any = null;
  public assignAlbum: number = 0;
  private canCrtAlbum: boolean;
  private albumCreate: Album;
  @ViewChild('uploadFileRef') elemUploadFile;

  constructor(private _zone: NgZone,
    private _router: Router,
    private _authService: AuthService,
    private _elmRef: ElementRef) {
    this._authService.authContent.subscribe((x) => {
      if (x.canUploadPhoto()) {
        let sizes = x.getUserUploadKBSize();
        this.photoMinKBSize = sizes[0];
        this.photoMaxKBSize = sizes[1];
      } else {
        this.photoMinKBSize = 0;
        this.photoMaxKBSize = 0;
      }
    });
    this.canCrtAlbum = this._authService.authSubject.getValue().canCreateAlbum();
    this.albumCreate = new Album();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let that = this;

    if (!this.uploader) {
      this.uploader = new qq.FineUploaderBasic({
        button: that.elemUploadFile.nativeElement,
        autoUpload: false,
        request: {
          endpoint: 'api/file',
          customHeaders: that.getcustomHeader()
        },
        validation: {
          allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
          minSizeLimit: that.photoMinKBSize * 1024,
          sizeLimit: that.photoMaxKBSize * 1024
        },
        callbacks: {
          onComplete: function (id, name, responseJSON) {
          },
          onAllComplete: function (succids, failids) {
          },
          onStatusChange: function (id: number, oldstatus, newstatus) {
          },
          onSubmit: function (id: number, name: string) {
          },
          onSubmitted: function (id: number, name: string) {
          },
          onTotalProgress: function (totalUploadedBytes: number, totalBytes: number) {
          },
          onUpload: function (id: number, name: string) {
          },
          onValidate: function (data) {
          }
        }
      });
    }
  }

  ngOnDestroy() {
  }

  getcustomHeader() {
    var obj = {
      Authorization: 'Bearer ' + this._authService.authSubject.getValue().getAccessToken()
    };
    return obj;
  }

    onAssignAblumClick(num: number | string) {
        this._zone.run(() => {
            this.assignAlbum = +num;
        });
    }

    isAssginToExistingAlbum(): boolean {
        return 1 === +this.assignAlbum;
    }

    isAssginToNewAlbum(): boolean {
        return 2 === +this.assignAlbum;
    }

    canUploadPhoto(): boolean {
        return this.photoMaxKBSize > 0;
    }

    canCreateAlbum(): boolean {
        return this.canCrtAlbum;
    }
}
