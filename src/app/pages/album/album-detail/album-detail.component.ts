import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OdataService } from 'src/app/services';

@Component({
  selector: 'album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.less']
})
export class AlbumDetailComponent implements OnInit {
  detailForm!: FormGroup;

  constructor(private odataSvc: OdataService,
    public _router: Router,
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
    }

  public onSave(): void {    
  }
}
