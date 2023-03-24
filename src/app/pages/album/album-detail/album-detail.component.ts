import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isCreateMode, isDisplayMode, isUIEditable, UIMode } from 'actslib';
import { ReplaySubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { Album, ConsoleLogTypeEnum, Photo, writeConsole } from 'src/app/models';
import { OdataService, UIInfoService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
  isLoadingResults = false;
  public routerID = -1; // Current object ID in routing
  public currentMode = '';
  public uiMode: UIMode = UIMode.Create;
  // Access code
  accessCodeHint = '';
  isAccessCodeDlgVisible = false;
  isAccessCodeSubmitting = false;
  accessCodeInputted = '';

  get isCreateMode(): boolean {
    return isCreateMode(this.uiMode);
  }
  get isDisplayMode(): boolean {
    return isDisplayMode(this.uiMode);
  }
  get isEditableMode(): boolean {
    return isUIEditable(this.uiMode);
  }

  constructor(
    private odataSvc: OdataService,
    public _router: Router,
    private activateRoute: ActivatedRoute,
    private uiSrv: UIInfoService,
    private fb: UntypedFormBuilder
  ) {}

  // submitForm(): void {
  //   for (const i in this.detailForm.controls) {
  //     this.detailForm.controls[i].markAsDirty();
  //     this.detailForm.controls[i].updateValueAndValidity();
  //   }
  // }

  ngOnInit(): void {
    this.detailForm = this.fb.group({
      headerControl: [new Album(), [Validators.required]],
    });
    this._destroyed$ = new ReplaySubject(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          this.odataSvc
            .readAlbum(this.routerID)
            .pipe(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              takeUntil(this._destroyed$!),
              finalize(() => {
                this.isLoadingResults = false;
              })
            )
            .subscribe({
              next: (rsts) => {
                this.detailForm.get('headerControl')?.setValue(rsts);
                if (this.isDisplayMode) {
                  this.detailForm.disable();
                } else {
                  this.detailForm.enable();
                }

                if (this.isDisplayMode) {
                  // Load the photos
                  this.accessCodeHint = rsts.accessCodeHint;
                  if (rsts.accessCodeHint) {
                    this.isAccessCodeDlgVisible = true;
                  } else {
                    this.handleAccessCodeDlgOk();
                  }
                }
              },
              error: (err) => {
                writeConsole(
                  `ACGallery [Error]: Entering AlbumDetailComponent ngOnInit, readAlbum ${err.toString()}`,
                  ConsoleLogTypeEnum.error
                );
              },
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
  onPaginationEvent(pgInfo: { pageSize: number; pageIndex: number }) {
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
    this.odataSvc
      .getAlbumRelatedPhotos(this.routerID, this.accessCodeInputted, skip, top)
      .pipe(
        finalize(() => {
          if (this.isAccessCodeDlgVisible) {
            this.isAccessCodeSubmitting = false;
            this.isAccessCodeDlgVisible = false;
          }
        })
      )
      .subscribe({
        next: (val) => {
          this.totalCount = val.totalCount;
          this.photos = []; // Clear it!
          for (let i = 0; i < val.items.Length(); i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.photos.push(val.items.GetElement(i)!);
          }
        },
        error: (err) => {
          writeConsole(
            `ACGallery [Error]: Entering AlbumDetail onFetchData: ${err.toString()}`,
            ConsoleLogTypeEnum.error
          );
        },
      });
  }

  public onSave(): void {
    // TBD.
  }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl) return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }

  onSearch(): void {
    this.uiSrv.AlbumIDForPhotoSearching = this.routerID;
    this.uiSrv.AlbumInfoForPhotoSearching = this.accessCodeInputted;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.uiSrv.AlbumTitleForPhotoSearching = this.detailForm.get('Title')!.value;
    this._router.navigate([`/photo/searchinalbum/${this.routerID}`]);
  }
}
