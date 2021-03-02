import { Component, OnInit } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { UpdPhoto } from 'src/app/models';
import { CanComponentDeactivate } from 'src/app/services';
import { environment } from 'src/environments/environment';


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
  confirmModal?: NzModalRef; // For testing by now

  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
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
  current = 0;

  index = 'First-content';

  photoFileAPI = environment.apiRootUrl + 'PhotoFile';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  fileList: NzUploadFile[] = [];
  filePhotos: UpdPhoto[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  editId: string | null = null;

  beforeUpload = (file: NzUploadFile): boolean => {
    console.log("Entering beforeUpload");

    this.fileList = this.fileList.concat(file);
    return false;
  };

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
