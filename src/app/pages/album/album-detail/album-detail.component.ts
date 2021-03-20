import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIMode } from 'actslib';
import { ReplaySubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { Album, Photo } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.less']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean>;

  detailForm!: FormGroup;
  totalCount = 0;
  photos: Photo[] = [];
  isLoadingResults: boolean;
  public routerID = -1; // Current object ID in routing
  public currentMode: string;
  public uiMode: UIMode = UIMode.Create;  
  
  get isCreateMode(): boolean { return this.uiMode === UIMode.Create; }
  get isDisplayMode(): boolean { return this.uiMode === UIMode.Display; }
  get isEditableMode(): boolean { return this.uiMode === UIMode.Create || this.uiMode === UIMode.Update; }

  constructor(private odataSvc: OdataService,
    public _router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  submitForm(): void {
    for (const i in this.detailForm.controls) {
      this.detailForm.controls[i].markAsDirty();
      this.detailForm.controls[i].updateValueAndValidity();
    }
  }
  
  // updateConfirmValidator(): void {
  //   /** wait for refresh value */
  //   Promise.resolve().then(() => this.detailForm.controls.checkPassword.updateValueAndValidity());
  // }
  
  // confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (control.value !== this.detailForm.controls.password.value) {
  //     return { confirm: true, error: true };
  //   }
  //   return {};
  // };
  
  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
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
            .pipe(takeUntil(this._destroyed$),
              finalize(() => {
                this.isLoadingResults = false;
              }))
            .subscribe({
              next: rsts => {
                this.detailForm.get('Title').setValue(rsts.Title);
                this.detailForm.get('Desp').setValue(rsts.Desp);
                this.detailForm.get('IsPublic').setValue(rsts.IsPublic);
                if (this.uiMode === UIMode.Display) {
                  this.detailForm.disable();
                } else {
                  this.detailForm.enable();
                }

                if (this.uiMode === UIMode.Display) {
                  this.odataSvc.getAlbumRelatedPhotos(this.routerID).subscribe({
                    next: val => {
                      // console.log(val);
                      this.totalCount = val.totalCount;
                      for(let i = 0; i < val.items.Length(); i++) {
                        this.photos.push(val.items.GetElement(i));
                      }
                    },
                    error: err => {
                      console.error(err);
                    }
                  });
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

  public onSave(): void {    
  }

  getFileUrl(pht: Photo): string {
    if (pht.fileUrl)
      return environment.apiRootUrl + 'PhotoFile/' + pht.fileUrl;
    return '';
  }
}
