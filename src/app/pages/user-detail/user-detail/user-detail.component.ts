import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UIMode } from 'actslib';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AuthService } from '../../../services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less'],
  imports: [
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
  ]
})
export class UserDetailComponent implements OnInit {
  detailForm!: UntypedFormGroup;
  uiMode = UIMode.Invalid;
  currentMode = 'Common.Display';

  readonly fb = inject(UntypedFormBuilder);
  readonly authSrv = inject(AuthService);
  readonly activateRoute = inject(ActivatedRoute);
  readonly modalService = inject(NzModalService);
  readonly translateService = inject(TranslocoService);

  constructor() {}

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: (err: any) => {
              this.detailForm.disable();
              // Show error
              this.modalService.error({
                nzTitle: this.translateService.translate('Common.Error'),
                nzContent: err.toString(),
                nzClosable: true,
              });
            },
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
    // TBD.
  }
}
