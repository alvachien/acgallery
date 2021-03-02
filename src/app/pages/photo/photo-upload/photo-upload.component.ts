import { Component, OnInit } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { UpdPhoto } from 'src/app/models';
import { CanComponentDeactivate } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'acgallery-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.less'],
})
export class PhotoUploadComponent implements OnInit, CanComponentDeactivate {
  fileList: NzUploadFile[] = [];
  filePhotos: UpdPhoto[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  editId: string | null = null;
  arAssignMode: any[] = [];
  assignMode = 0;
  current = 0;
  photoFileAPI = environment.apiRootUrl + 'PhotoFile';
  albumForm!: FormGroup;

  constructor(private modal: NzModalService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.arAssignMode.push({value: 0, name: 'Photo.Upload_NoAlbum',});
    this.arAssignMode.push({value: 1, name: 'Photo.Upload_AssignExistAlbum',});
    this.arAssignMode.push({value: 2, name: 'Photo.Upload_AssignNewAlbum', });

    this.albumForm = this.fb.group({
      Title: ['', [Validators.required]],
      Desp: ['', [Validators.required]],
      IsPublic: [false]
    });
  }

  canDeactivate(): Observable<boolean> | boolean {    
    // // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    // if (!this.crisis || this.crisis.name === this.editName) {
    //   return true;
    // }
    // // Otherwise ask the user with the dialog service and return its
    // // observable which resolves to true or false when the user decides
    // return this.dialogService.confirm('Discard changes?');
    if (this.filePhotos.length > 0) {
      this.modal.confirm({
        nzTitle: 'Do you Want to delete these items?',
        nzContent: 'When clicked the OK button, this dialog will be closed after 1 second'
      });
      return false;
    }
    return true;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  get nextButtonEnabled(): boolean {
    let isenabled = false;
    switch (this.current) {
      case 0:   isenabled = this.fileList.length > 0;   break;
      case 1: {
        isenabled = true;
        for(let i = 0; i < this.filePhotos.length; i++) {
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
        } else if (this.assignMode === 2) {
          // New album
          isenabled = this.albumForm.valid;
        }
      }
      default:
        break;
    }
    return isenabled;
  }

  done(): void {
    console.log('done');
  }

  // beforeUpload = (file: NzUploadFile): boolean => {
  //   console.log("Entering beforeUpload");

  //   this.fileList = this.fileList.concat(file);
  //   return false;
  // };

  handlePreview = async (file: NzUploadFile) => {
    console.log("Entering handlePreview");

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    console.log("Entering handleChange");

    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }

    if (file.status === 'done') {
      console.log(`${file.name} file uploaded successfully`);
      let pobj = new UpdPhoto();
      pobj.uid = file.uid;
      pobj.orgName = file.name;
      // pobj.imgSrc = environment.apiRootUrl + file.url;
      // pobj.thumbSrc = environment.apiRootUrl + file.thumbUrl;
      pobj.thumbSrc = file.thumbUrl;
      pobj.imgSrc = environment.apiRootUrl + file.response.url;
      pobj.size = file.size.toString();
      
      this.filePhotos.push(pobj);
    
    } else if (file.status === 'error') {
      console.error(`${file.name} file upload failed.`);
    }
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }
}
