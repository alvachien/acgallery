import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, 
  UntypedFormControl, UntypedFormGroup, ValidationErrors, Validator, Validators 
} from '@angular/forms';
import { mergeWith } from 'rxjs/operators';

import { Album } from 'src/app/models';

@Component({
  selector: 'acgallery-album-header',
  templateUrl: './album-header.component.html',
  styleUrls: ['./album-header.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AlbumHeaderComponent),
      multi: true,
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AlbumHeaderComponent),
      multi: true,
    },
  ],
})
export class AlbumHeaderComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  propagateOnChange: (value: any) => void = (_: any) => {};
  propagateOnTouched: (value: any) => void = (_: any) => {};

  public headerFormGroup: UntypedFormGroup = new UntypedFormGroup({
    titleCtrl: new UntypedFormControl('', [Validators.required]),
    despCtrl: new UntypedFormControl(''),
    isPublicCtrl: new UntypedFormControl(false),
    needAccessCodeCtrl: new UntypedFormControl(false),
    accessCodeCtrl: new UntypedFormControl({value: undefined, disabled: true}),
    accessCodeHintCtrl: new UntypedFormControl({value: undefined, disabled: true}),
  });

  // Create mode
  _createMode = false;
  @Input() createMode(val: boolean) {
    this._createMode = val;

    if (!this._createMode) {
      this.headerFormGroup.removeControl('needAccessCodeCtrl');
      this.headerFormGroup.removeControl('accessCodeCtrl');
      this.headerFormGroup.removeControl('accessCodeHintCtrl');
    } else {
      //this.headerFormGroup.addControl('needAccessCodeCtrl');
    }
  }

  constructor() {
    const title$ = this.headerFormGroup.get('titleCtrl')?.valueChanges;
    const desp$ = this.headerFormGroup.get('despCtrl')?.valueChanges;
    const isPublic$ = this.headerFormGroup.get('isPublicCtrl')?.valueChanges;
    const needAccessCode$ = this.headerFormGroup.get('needAccessCodeCtrl')?.valueChanges;
    const accessCode$ = this.headerFormGroup.get('accessCodeCtrl')?.valueChanges;
    const accessCodeHint$ = this.headerFormGroup.get('accessCodeHintCtrl')?.valueChanges;

    needAccessCode$?.subscribe({
      next: val => {
        if (val) {
          this.headerFormGroup.get('accessCodeCtrl')?.enable();
          this.headerFormGroup.get('accessCodeHintCtrl')?.enable();
        }
      },
      error: err => {        
      }
    });

    this.headerFormGroup.valueChanges.subscribe({
      next: val => {
        this.propagateOnChange(val);
      }
    })
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {      
  }

  writeValue(obj: Album): void {
    // Update value
    if (obj) {
      this.headerFormGroup.get('titleCtrl')?.setValue(obj.Title);
      this.headerFormGroup.get('despCtrl')?.setValue(obj.Desp);
      this.headerFormGroup.get('isPublicCtrl')?.setValue(obj.IsPublic);
      this.headerFormGroup.get('accessCodeCtrl')?.setValue(obj.AccessCode);
      this.headerFormGroup.get('accessCodeCtrl')?.setValue(obj.accessCodeHint);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateOnChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateOnTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.headerFormGroup.disable();
    } else {
      this.headerFormGroup.enable();
    }
  }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    // throw new Error('Method not implemented.');
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    //throw new Error('Method not implemented.');
  }  
}
