import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable, Observer } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { translate } from '@ngneat/transloco';

import { Album, ConsoleLogTypeEnum, Photo, SelectableAlbum, UpdPhoto, UserDetail, writeConsole } from 'src/app/models';
import { AuthService, CanComponentDeactivate, OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'acgallery-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.less'],
})
export class PhotoUploadComponent implements OnInit, CanComponentDeactivate {
  // Current step
  currentStep = 0;
  private _userDetail: UserDetail | undefined = undefined;
  // Step 1. Choose file to upload
  photoFileAPI = environment.apiRootUrl + 'PhotoFile';
  fileUploadList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  editId: string | null = null;
  // Step 2. Change the info of files
  filePhotos: UpdPhoto[] = [];
  // Step 3. Assign to album
  arAssignMode: any[] = [];
  assignMode = 0;
  albumForm!: UntypedFormGroup;
  listOfAlbums: ReadonlyArray<Album> = [];
  listOfData: ReadonlyArray<Album> = [];
  setOfChosedAlbumIDs = new Set<number>();
  // Step 4. Result
  isErrorOccurred = false;
  errorInfo = '';
  // Tag
  inputTagValue = '';

  constructor(private modal: NzModalService,
    private fb: UntypedFormBuilder,
    private odataSvc: OdataService,
    private router: Router,
    private authService: AuthService,
    private msg: NzMessageService,) { 
    this.arAssignMode.push({ value: 0, name: 'Photo.Upload_NoAlbum', });
    this.arAssignMode.push({ value: 1, name: 'Photo.Upload_AssignExistAlbum', });
    this.arAssignMode.push({ value: 2, name: 'Photo.Upload_AssignNewAlbum', });

    this.albumForm = this.fb.group({
      headerControl: [new Album(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.clearContent();

    forkJoin([
      this.odataSvc.getAlbums(),
      this.authService.getUserDetail()  
    ]).subscribe({
      next: val => {
        // Value 0: albums
        let arAlbums: any[] = [];
        for(let i = 0; i < val[0].items.Length(); i++) {
          let selalb = new SelectableAlbum();
          let alb = val[0].items.GetElement(i);
          selalb.Id = alb!.Id;
          selalb.Title = alb!.Title;
          selalb.Desp = alb!.Desp;
          arAlbums.push(selalb);
        }
        this.listOfAlbums = arAlbums.map(_ => _);

        // value 1: User detail
        this._userDetail = val[1];
      },
      error: err => {
        this.modal.error({
          nzTitle: translate('Common.Error'),
          nzContent: err,
          nzClosable: true,
        });
      }
    });
  }

  private clearContent() {
    this.fileUploadList = [];
    this.filePhotos = [];
    this.setOfChosedAlbumIDs.clear();
    this.isErrorOccurred = false;
    this.errorInfo = '';
    this.albumForm.reset();
  }

  canDeactivate(): Observable<boolean> | boolean {
    // // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // // Otherwise ask the user with the dialog service and return its
    // // observable which resolves to true or false when the user decides
    // return this.dialogService.confirm('Discard changes?');

    // TBD.
    // if (this.filePhotos.length > 0) {
    //   this.modal.confirm({
    //     nzTitle: 'Photo uploading in process, discard them?',
    //     nzContent: 'When clicked the OK button, this dialog will be closed after 1 second'
    //   });
    //   return false;
    // }
    return true;
  }

  pre(): void {
    writeConsole('ACGallery [Debug]: Entering PhotoUpload pre()...', ConsoleLogTypeEnum.debug);

    this.currentStep -= 1;
  }

  next(): void {
    writeConsole('ACGallery [Debug]: Entering PhotoUpload next()...', ConsoleLogTypeEnum.debug);

    if (this.currentStep === 0) {
      // Upload the photo
      this.currentStep ++;
    } else if (this.currentStep === 1) {
      // Change the title, desp
      this.updatePhotoInfo();
    } else if (this.currentStep === 2) {
      // Assign the albums
      this.assignPhotoToAlbum();
    }
  }

  get nextButtonEnabled(): boolean {
    let isenabled = false;
    switch (this.currentStep) {
      case 0: isenabled = this.fileUploadList.length > 0; break;
      case 1: {
        isenabled = true;
        for (let i = 0; i < this.filePhotos.length; i++) {
          if (!this.filePhotos[i].isValid) {
            isenabled = false;
            break;
          }
        }
      }
      break;

      case 2: {
        if (this.assignMode === 0) {
          isenabled = true;
        } else if (this.assignMode === 1) {
          // Existing albums
          isenabled = this.setOfChosedAlbumIDs.size > 0;
        } else if (this.assignMode === 2) {
          // New album
          isenabled = this.albumForm.valid;
        }
      }
      break;

      default:
      break;
    }
    return isenabled;
  }

  // Step 1. Choose photo to upload
  handleUploadPreview = async (file: NzUploadFile) => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      writeConsole('ACGallery [Debug]: Entering PhotoUpload beforeUpload()...', ConsoleLogTypeEnum.debug);

      if (!this._userDetail?.photoUpload) {
        this.msg.error('You are not allow to upload file!');
        observer.complete();
        return;
      }

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }

      const overSize = file.size! / 1024 < this._userDetail?.uploadFileMaxSize!;
      if (!overSize) {
        this.msg.error(`Image must smaller than ${this._userDetail?.uploadFileMaxSize} KB!`);
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && overSize);
      observer.complete();
  });

  handleUploadChange({ file, fileList }: NzUploadChangeParam): void {
    writeConsole('ACGallery [Debug]: Entering PhotoUpload handleUploadChange...', ConsoleLogTypeEnum.debug);

    if (file.status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully`);
      let pobj = new UpdPhoto();
      pobj.uid = file.uid;
      pobj.orgName = file.name;
      // pobj.imgSrc = environment.apiRootUrl + file.url;
      // pobj.thumbSrc = environment.apiRootUrl + file.thumbUrl;
      pobj.thumbFile = file.response.thumbnailUrl;
      pobj.imgFile = file.response.url;
      pobj.size = file.size!.toString();
      pobj.name = file.response.name;
      pobj.width = file.response.width;
      pobj.height = file.response.height;
      pobj.thumbWidth = file.response.thumbwidth;
      pobj.thumbHeight = file.response.thumbheight;
      pobj.title = pobj.name;
      pobj.desp = pobj.name;

      this.filePhotos.push(pobj);
    } else if (file.status === 'error') {
      this.msg.error(`${file.name} file upload failed`);
    } else if (file.status === 'removed') {
      this.msg.info(`${file.name} file removed`);
    } else if (file.status === 'uploading') {
      this.msg.info(`${file.name} file uploading`);
    }
  }

  // Step 2. Update photo info
  updatePhotoInfo(): void {
    let arreqs: Array<Observable<any>> = [];
    this.filePhotos.forEach(updpto => {
      arreqs.push(this.odataSvc.changePhotoInfo(updpto.name, updpto.title, updpto.desp, updpto.isPublic));

      if (updpto.tags.length > 0) {
        updpto.tags.forEach(tag => {
          arreqs.push(this.odataSvc.createPhotoTag(updpto.name, tag));
        });
      }
    });

    forkJoin(arreqs)
      .pipe(
        // takeUntil(this._destroyed$),
        finalize(() => {
          // this.isLoadingResults = false;
        }))
      .subscribe({
        next: (val: any) => {
          console.debug(`Step ${this.currentStep}: Photo info updated successfully, go to next step`);
          this.currentStep ++;
          console.debug(`Now Step is ${this.currentStep}`);
        },
        error: (err: any) => {
          this.msg.error(err);
          writeConsole(`ACGallery [Error]: Entering AlbumListComponent updatePhotoInfo updatePhotoInfo ${err.toString()}`, ConsoleLogTypeEnum.error);
        }
    });
  }

  // Step 3. Assign to albums
  assignPhotoToAlbum(): void {
    switch (this.assignMode) {
      case 0: {
        // No assign to album
        this.currentStep ++;
      }
      break;

      case 1: {
        // Assign to existing album
        this.assignPhotoToExistingAlbums();
      }
      break;

      case 2: {
        // Assign to new album
        this.assignPhotoToNewAlbum();
      }
      break;

      default:
      break;
    }
  }
  getUploadHeader = (file: NzUploadFile) : Object | Observable<{}> => {
    return {
      'Authorization': 'Bearer ' + this.authService.authSubject.getValue().getAccessToken()
    };
  };

  updateExistedAlbumSelected(id: number, checked: boolean): void {
    if (checked) {
      this.setOfChosedAlbumIDs.add(id);
    } else {
      this.setOfChosedAlbumIDs.delete(id);
    }
  }

  onExistedAlbumSelected(id: number, checked: boolean): void {
    this.updateExistedAlbumSelected(id, checked);
  }
  onCurrentPageDataChange($event: ReadonlyArray<Album>): void {
    // this.listOfCurrentPageData = $event;
    // this.refreshCheckedStatus();
  }
  assignPhotoToExistingAlbums(): void {
    const arreq: Array<Observable<any>> = [];
    this.setOfChosedAlbumIDs.forEach(albid => {
      this.filePhotos.forEach((updpht, index) => {
        arreq.push(this.odataSvc.assignPhotoToAlbum(albid, updpht.name));
      });
    });
    forkJoin(arreq).subscribe({
      next: (lik) => {
        writeConsole(`ACGallery [Debug]: Entering PhotoUpload assignPhotoToExistingAlbums, Step ${this.currentStep}: Photo assigned to existing albums successfully, go to next step...`, ConsoleLogTypeEnum.debug);
        this.currentStep ++;
        writeConsole(`ACGallery [Debug]: Entering PhotoUpload assignPhotoToExistingAlbums, Now Step is ${this.currentStep}`, ConsoleLogTypeEnum.debug);
      },
      error: (err) => {
        this.msg.error(err);

        writeConsole(`ACGallery [Error]: Entering PhotoUpload assignPhotoToExistingAlbums, forkJoin ${err}`, ConsoleLogTypeEnum.error);

        this.isErrorOccurred = true;
        this.errorInfo = err;
      }
    });
  }
  assignPhotoToNewAlbum(): void {
    // New create album
    let alb = new Album();    
    let headerval = this.albumForm.get('headerControl')?.value;
    alb.Title = headerval.titleCtrl;
    alb.Desp = headerval.despCtrl;
    alb.IsPublic = headerval.isPublicCtrl;
    alb.AccessCode = headerval.accessCodeCtrl;
    alb.accessCodeHint = headerval.accessCodeHintCtrl;

    this.odataSvc.createAlbum(alb).subscribe({
      next: (val: Album) => {
        alb.Id = val.Id;

        // Update the album/photo bindings
        let arreq2: Array<Observable<any>> = [];
        this.filePhotos.forEach((updpto, index) => {
          arreq2.push(this.odataSvc.assignPhotoToAlbum(alb.Id, updpto.name));
        });
        forkJoin(arreq2).subscribe({
          next: (lik) => {
            writeConsole(`ACGallery [Debug]: Entering PhotoUpload assignPhotoToNewAlbum, Step ${this.currentStep}: Photo assigned to new created album successfully, go to next step...`, ConsoleLogTypeEnum.debug);
            this.currentStep ++;
            writeConsole(`ACGallery [Debug]: Entering PhotoUpload assignPhotoToNewAlbum, Now Step is ${this.currentStep}`, ConsoleLogTypeEnum.debug);
          },
          error: (err) => {
            writeConsole(`ACGallery [Error]: Entering PhotoUpload assignPhotoToNewAlbum, forkJoin ${err.toString()}`, ConsoleLogTypeEnum.error);

            this.isErrorOccurred = true;
            this.errorInfo = err;
          }
        });
      },
      error: (err : any) => {
        writeConsole(`ACGallery [Error]: Entering PhotoUpload assignPhotoToNewAlbum, createAlbum ${err.toString()}`, ConsoleLogTypeEnum.error);

        this.isErrorOccurred = true;
        this.errorInfo = err;
      }
    });
  }

  // Tags
  handleTagClose(pto: UpdPhoto, removedTag: {}): void {
    pto.tags = pto.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  handleTagInputConfirm(pto: UpdPhoto): void {
    if (this.inputTagValue && pto.tags.indexOf(this.inputTagValue) === -1) {
      pto.tags = [...pto.tags, this.inputTagValue];
    }
    this.inputTagValue = '';
  }
  
  // Result page
  onGoToPhotoList(): void {
    this.router.navigate(['photo']);
  }
  onUploadFurther(): void {
    this.clearContent();
    this.currentStep = 0;
  }
}
