import { ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, 
  UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validator, Validators 
} from '@angular/forms';

import { Album } from 'src/app/models';
import { isCreateMode, isUpdateMode, UIMode } from 'actslib';
import { Subject, takeUntil } from 'rxjs';

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

  private destroy$ = new Subject<void>();
  public headerFormGroup!: UntypedFormGroup;

  // UI mode
  _uiMode: UIMode = UIMode.Invalid;
  
  @Input('ui-mode') 
  get uiMode(): UIMode {
    return this._uiMode 
  }
  set uiMode(val: UIMode) {
    this._uiMode = val;

    if (this.headerFormGroup) {
      if (isUpdateMode(this._uiMode) || isCreateMode(this._uiMode)) {
        this.headerFormGroup.enable();
      } else {
        this.headerFormGroup.disable();
      }  
    }
  }

  get isAccessCodeVisible(): boolean {
    return isUpdateMode(this._uiMode) || isCreateMode(this._uiMode);
  }

  constructor(private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.headerFormGroup = this.fb.group({
      titleCtrl: new UntypedFormControl('', [Validators.required]),
      despCtrl: new UntypedFormControl(''),
      isPublicCtrl: new UntypedFormControl(),
      accessCodeCtrl: new UntypedFormControl({value: undefined, disabled: true}),
      accessCodeHintCtrl: new UntypedFormControl({value: undefined, disabled: true}),
    });

    this.headerFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: val => {
        console.debug(`Entering AlbumHeaderComponent's headerFormGroup valueChange callback: ${ val ? JSON.stringify(val) : 'NULL'}`);
        this.propagateOnChange(val);
      }
    });
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete();         
  }

  writeValue(obj: Album): void {
    console.debug(`Entering AlbumHeaderComponent's writeValue: ${ obj ? obj.writeJSONString() : 'NULL'}`);
    // Update value
    if (obj) {
      this.headerFormGroup.get('titleCtrl')?.setValue(obj.Title);
      this.headerFormGroup.get('despCtrl')?.setValue(obj.Desp);
      this.headerFormGroup.get('isPublicCtrl')?.setValue(obj.IsPublic);
      this.headerFormGroup.get('accessCodeCtrl')?.setValue(obj.AccessCode);
      this.headerFormGroup.get('accessCodeHintCtrl')?.setValue(obj.accessCodeHint);
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
