import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { getTranslocoModule } from 'src/testing';

import { AlbumHeaderComponent } from './';

describe('AlbumHeaderCreateComponent', () => {
  let component: AlbumHeaderCreateComponent;
  let fixture: ComponentFixture<AlbumHeaderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        BrowserDynamicTestingModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        getTranslocoModule(),
      ],
      declarations: [ 
        AlbumHeaderComponent,
        AlbumHeaderCreateComponent,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumHeaderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `
  <form [formGroup]="formGroup">
    <acgallery-album-header formControlName="headerControl" [createMode]="true">
    </acgallery-album-header>
  </form>
  `
})
export class AlbumHeaderCreateComponent {
  public formGroup: UntypedFormGroup;

  @ViewChild(AlbumHeaderComponent, {static: true}) headerComponent: AlbumHeaderComponent | undefined;

  constructor() {
    this.formGroup = new UntypedFormGroup({
      headerControl: new UntypedFormControl()
    });
  }
}

describe('AlbumHeaderDisplayComponent', () => {
  let component: AlbumHeaderDisplayComponent;
  let fixture: ComponentFixture<AlbumHeaderDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        BrowserDynamicTestingModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        getTranslocoModule(),
      ],
      declarations: [ 
        AlbumHeaderComponent,
        AlbumHeaderDisplayComponent,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumHeaderDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `
  <form [formGroup]="formGroup">
    <acgallery-album-header formControlName="headerControl">
    </acgallery-album-header>
  </form>
  `
})
export class AlbumHeaderDisplayComponent {
  public formGroup: UntypedFormGroup;

  @ViewChild(AlbumHeaderComponent, {static: true}) headerComponent: AlbumHeaderComponent | undefined;

  constructor() {
    this.formGroup = new UntypedFormGroup({
      headerControl: new UntypedFormControl()
    });
  }
}

