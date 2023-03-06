import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NzCheckboxComponent, NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Album } from 'src/app/models';
import { getTranslocoModule } from 'src/testing';

import { AlbumHeaderComponent } from './';

describe('AlbumHeaderCreateComponent', () => {
  let component: AlbumHeaderCreateComponent;
  let fixture: ComponentFixture<AlbumHeaderCreateComponent>;

  beforeEach(waitForAsync(() => {
    //await 
    TestBed.configureTestingModule({
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
        NzGridModule,
        getTranslocoModule(),
      ],
      declarations: [ 
        AlbumHeaderComponent,
        AlbumHeaderCreateComponent,
        AlbumHeaderEditComponent,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumHeaderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


describe('AlbumHeaderDisplayComponent', () => {
  let component: AlbumHeaderDisplayComponent;
  let fixture: ComponentFixture<AlbumHeaderDisplayComponent>;

  beforeEach(waitForAsync(() => {
    //await 
    TestBed.configureTestingModule({
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
        NzGridModule,
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
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shall display data', fakeAsync(() => {
    flush();

    let album: Album = new Album();
    album.Title = 'testTitle';
    album.Desp = 'testDesp';
    album.IsPublic = true;
    component.setData(album);

    const inputTitle = fixture.nativeElement.querySelector('#title');
	  expect(inputTitle.value).toBe(album.Title);
    const inputDesp = fixture.nativeElement.querySelector('#desp');
	  expect(inputDesp.value).toBe(album.Desp);
    // const chkComponent = fixture.debugElement.query(By.css('#ispublic'));
    // const chkinputElement = chkComponent.nativeElement.querySelector('input') as HTMLInputElement;
    expect(component.headerComponent!.headerFormGroup!.get('isPublicCtrl')!.value).toBeTrue();    

    album.Title = 'testTitle2';
    album.Desp = 'testDesp2';
    album.IsPublic = false;
    component.setData(album);

	  expect(inputTitle.value).toBe(album.Title);
	  expect(inputDesp.value).toBe(album.Desp);   
    //expect(chkinputElement.checked).toBeFalse();
    expect(component.headerComponent!.headerFormGroup!.get('isPublicCtrl')!.value).toBeFalse();
  }));
});

describe('AlbumHeaderEditComponent', () => {
  let component: AlbumHeaderEditComponent;
  let fixture: ComponentFixture<AlbumHeaderEditComponent>;

  beforeEach(waitForAsync(() => {
    //await 
    TestBed.configureTestingModule({
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
        NzGridModule,
        getTranslocoModule(),
      ],
      declarations: [ 
        AlbumHeaderComponent,
        AlbumHeaderEditComponent,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumHeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shall display data', fakeAsync(() => {
    flush();
    fixture.detectChanges();

    let album: Album = new Album();
    album.Title = 'testTitle';
    album.Desp = 'testDesp';
    album.IsPublic = true;
    album.AccessCode = 'aaa';
    album.accessCodeHint = 'Hint';
    component.setData(album);

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const inputTitle = fixture.nativeElement.querySelector('#title');
	  expect(inputTitle.value).toBe(album.Title);
    const inputDesp = fixture.nativeElement.querySelector('#desp');
	  expect(inputDesp.value).toBe(album.Desp);
    // const chkComponent = fixture.debugElement.query(By.css('#ispublic'));
    // const chkinputElement = chkComponent.nativeElement.querySelector('input') as HTMLInputElement;
    expect(component.headerComponent!.headerFormGroup!.get('isPublicCtrl')!.value).toBeTrue();
    const inputAccessCode = fixture.nativeElement.querySelector('#accode');
    expect(inputAccessCode.value).toBe(album.AccessCode);
    const inputAccessCodeHint = fixture.nativeElement.querySelector('#accodehint');
    expect(inputAccessCodeHint.value).toBe(album.accessCodeHint);

    // Check the need access code
    expect(component.headerComponent!.headerFormGroup!.get('needAccessCodeCtrl')!.value).toBeTrue();
  }));
});


@Component({
  template: `
  <form [formGroup]="formGroup">
    <acgallery-album-header formControlName="headerControl" [uiMode]="1">
    </acgallery-album-header>
  </form>
  `
})
export class AlbumHeaderCreateComponent implements OnInit {
  public formGroup!: UntypedFormGroup;

  @ViewChild(AlbumHeaderComponent, {static: true}) headerComponent: AlbumHeaderComponent | undefined;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      headerControl: [null],
    });
  }
}

@Component({
  template: `
  <form [formGroup]="formGroup">
    <acgallery-album-header formControlName="headerControl" [uiMode]="3">
    </acgallery-album-header>
  </form>
  `
})
export class AlbumHeaderDisplayComponent implements OnInit {
  public formGroup!: UntypedFormGroup;

  @ViewChild(AlbumHeaderComponent, {static: false}) headerComponent: AlbumHeaderComponent | undefined;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      headerControl: [null],
    });
  }

  setData(objAlbum: Album) {
    this.formGroup.get('headerControl')?.setValue(objAlbum);
  }
}

@Component({
  template: `
  <form [formGroup]="formGroup">
    <acgallery-album-header formControlName="headerControl" [uiMode]="2">
    </acgallery-album-header>
  </form>
  `
})
export class AlbumHeaderEditComponent implements OnInit {
  public formGroup!: UntypedFormGroup;

  @ViewChild(AlbumHeaderComponent, {static: false}) headerComponent: AlbumHeaderComponent | undefined;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      headerControl: [null],
    });
  }

  setData(objAlbum: Album) {
    this.formGroup.get('headerControl')?.setValue(objAlbum);
  }
}
