import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIMode } from 'actslib';
import { ReplaySubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { Album, Photo } from 'src/app/models';
import { OdataService, UIInfoService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.less'],
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  private _destroyed$?: ReplaySubject<boolean>;

  detailForm!: UntypedFormGroup;
  totalCount = 0;
  pageSize = 20;
  photos: Photo[] = [];
  isLoadingResults: boolean = false;
  public routerID = -1; // Current object ID in routing
  public currentMode: string = '';
  public uiMode: UIMode = UIMode.Create;
  // Access code
  accessCodeHint = '';
  isAccessCodeDlgVisible = false;
  isAccessCodeSubmitting = false;
  accessCodeInputted = '';

  get isCreateMode(): boolean { return this.uiMode === UIMode.Create; }
  get isDisplayMode(): boolean { return this.uiMode === UIMode.Display; }
  get isEditableMode(): boolean { return this.uiMode === UIMode.Create || this.uiMode === UIMode.Update; }

  constructor(private odataSvc: OdataService,
    public _router: Router,
    private activateRoute: ActivatedRoute,
    private uiSrv: UIInfoService,
    private fb: UntypedFormBuilder) { }

  submitForm(): void {
    for (const i in this.detailForm.controls) {
      this.detailForm.controls[i].markAsDirty();
      this.detailForm.controls[i].updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.detailForm = this.fb.group({
      Title: ['', [Validators.required]],
      Desp: ['', [Validators.required]],
      IsPublic: [false]
    });
    this._destroyed$ = new ReplaySubject(1);

    this.activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === 'create') {
          this.uiMode = UIMode.Create;
          this.currentMode = 'Common.Create';
        } else if (x[0].path === 'change') {
          this.routerID = +x[1].path;

          this.uiMode = UIMode.Update;
          this.currentMode = 'Common.Edit';
        } else if (x[0].path === 'display') {
          this.routerID = +x[1].path;

          this.uiMode = UIMode.Display;
          this.currentMode = 'Common.Display';
        }
      }

      switch (this.uiMode) {
        case UIMode.Update:
        case UIMode.Display: {
          this.isLoadingResults = true;

          // Read the album
          this.odataSvc.readAlbum(this.routerID)
            .pipe(takeUntil(this._destroyed$!),
              finalize(() => {
                this.isLoadingResults = false;
              }))
            .subscribe({
              next: rsts => {
                this.detailForm.get('Title')?.setValue(rsts.Title);
                this.detailForm.get('Desp')?.setValue(rsts.Desp);
                this.detailForm.get('IsPublic')?.setValue(rsts.IsPublic);
                if (this.uiMode === UIMode.Display) {
                  this.detailForm.disable();
                } else {
                  this.detailForm.enable();
                }

                if (this.uiMode === UIMode.Display) {
                  // Load the photos
                  this.accessCodeHint = rsts.accessCodeHint;
                  if (rsts.accessCodeHint) {
                    this.isAccessCodeDlgVisible = true;
                  } else {
                    this.handleAccessCodeDlgOk();
                  }
                }
              },
              error: err => {
                console.error(err);
              }
            });
          break;
        }

        case UIMode.Create:
        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    if (this._destroyed$) {
      this._destroyed$.next(true);
      this._destroyed$.complete();
    }
  }
  onPaginationEvent(pgInfo: {pageSize: number, pageIndex: number}) {
    const top = pgInfo.pageSize;
    const skip = pgInfo.pageSize * (pgInfo.pageIndex - 1);
    this.onFetchData(top, skip);
  }
  handleAccessCodeDlgCancel() {
    this.isAccessCodeDlgVisible = false;
  }
  handleAccessCodeDlgOk() {
    this.isAccessCodeSubmitting = true;

    this.onFetchData(20, 0);
  }
  onFetchData(top: number, skip: number): void {
    this.odataSvc.getAlbumRelatedPhotos(this.routerID, this.accessCodeInputted, skip, top)
      .pipe(finalize(() => {
        if (this.isAccessCodeDlgVisible) {
          this.isAccessCodeSubmitting = false;
          this.isAccessCodeDlgVisible = false;
        }
      }))
      .subscribe({
        next: val => {
          this.totalCount = val.totalCount;
          this.photos = []; // Clear it!
          for (let i = 0; i < val.items.Length(); i++) {
            this.photos.push(val.items.GetElement(i)!);
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  public onSave(): void {
  }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }

  onSearch(): void {
    this.uiSrv.AlbumIDForPhotoSearching = this.routerID;
    this.uiSrv.AlbumInfoForPhotoSearching = this.accessCodeInputted;
    this.uiSrv.AlbumTitleForPhotoSearching = this.detailForm.get('Title')!.value;
    this._router.navigate([`/photo/searchinalbum/${this.routerID}`]);
  }
}
