import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { UIMode } from 'actslib';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AuthService, OdataService } from 'src/app/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less'],
})
export class UserDetailComponent implements OnInit {
  detailForm!: UntypedFormGroup;
  uiMode = UIMode.Invalid;
  currentMode = 'Common.Display';

  constructor(private fb: UntypedFormBuilder,
    private authSrv: AuthService,
    private activateRoute: ActivatedRoute,
    private modalService: NzModalService,) { }

  get isEditableMode(): boolean {
    return this.uiMode === UIMode.Update;
  }

  ngOnInit(): void {
    this.detailForm = this.fb.group({
      userId: [null, [Validators.required]],
      displayAs: [null],
      // email: [null],
      uploadFileMinSize: [0],
      uploadFileMaxSize: [0],
      albumCreate: [false],
      photoUpload: [false],
    });
    
    this.activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === 'create') {
          this.uiMode = UIMode.Create;
          this.currentMode = 'Common.Create';
        } else if (x[0].path === 'change') {
          this.uiMode = UIMode.Update;
          this.currentMode = 'Common.Edit';
        } else if (x[0].path === 'display') {
          this.uiMode = UIMode.Display;
          this.currentMode = 'Common.Display';
        }
      }

      switch (this.uiMode) {
        case UIMode.Update:
        case UIMode.Display: {
          this.authSrv.getUserDetail().subscribe({
            next: (val: any) => {
              this.detailForm.setValue({
                userId: val.userId,
                displayAs: val.displayAs,
                // email: val.email,
                uploadFileMinSize: val.uploadFileMinSize,
                uploadFileMaxSize: val.uploadFileMaxSize,
                albumCreate: val.albumCreate,
                photoUpload: val.photoUpload,
              });

              if (this.uiMode === UIMode.Display) {
                this.detailForm.disable();
              } else {
                this.detailForm.enable();
                this.detailForm.markAsUntouched();
                this.detailForm.markAsPristine();
              }
            },
            error: (err: any) => {
              this.detailForm.disable();
              // Show error
              this.modalService.error({
                nzTitle: translate('Common.Error'),
                nzContent: err,
                nzClosable: true,
              });
            }
          });
          break;
        }

        case UIMode.Create:
        default: {
          break;
        }
      }
    });
  }

  onSave(): void {    
  }
}
