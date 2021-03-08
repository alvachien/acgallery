import { Component, OnInit } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { Album, Photo, SelectableAlbum, UpdPhoto } from 'src/app/models';
import { CanComponentDeactivate, OdataService } from 'src/app/services';
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
  listOfAlbums: SelectableAlbum[] = [];

  constructor(
    private modal: NzModalService,
    private fb: FormBuilder,
    private odataSvc: OdataService) { }

  ngOnInit(): void {
    this.arAssignMode.push({ value: 0, name: 'Photo.Upload_NoAlbum', });
    this.arAssignMode.push({ value: 1, name: 'Photo.Upload_AssignExistAlbum', });
    this.arAssignMode.push({ value: 2, name: 'Photo.Upload_AssignNewAlbum', });

    this.odataSvc.getAlbums().subscribe({
      next: val => {
        // Value
        for(let i = 0; i < val.items.Length(); i++) {
          let selalb = new SelectableAlbum();
          let alb = val.items.GetElement(i);
          selalb.Id = alb.Id;
          selalb.Title = alb.Title;
          selalb.Desp = alb.Desp;
          this.listOfAlbums.push(selalb);
        }
      },
      error: err => {
        // Error
      }
    })

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
        nzTitle: 'Photo uploading in process, discard them?',
        nzContent: 'When clicked the OK button, this dialog will be closed after 1 second'
      });
      return false;
    }
    return true;
  }

  onAllAlbumChecked() {
    
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    if (this.current === 2) {
      let arreqs = this.getPhotosToBeUpload();
      switch (this.assignMode) {
        case 0: {          
          forkJoin(arreqs)
            .pipe(
              // takeUntil(this._destroyed$),
              finalize(() => {
                // this.isLoadingResults = false;
              }))
            .subscribe({
              next: (val: any) => {
                this.filePhotos = [];
                this.fileList = [];
              },
              error: (err: any) => {
              }
            });
        }
        break;

        case 1: {

        }
        break;

        case 2: {
          // New create album
          let alb = new Album();
          alb.Title = this.albumForm.get('Title').value;
          alb.Desp = this.albumForm.get('Desp').value;
          alb.IsPublic = this.albumForm.get('IsPublic').value;
          // alb.CreatedAt = new Date();
          this.odataSvc.createAlbum(alb).subscribe({
            next: (val: Album) => {
              alb.Id = val.Id;

              forkJoin(arreqs)
                .pipe(
                  // takeUntil(this._destroyed$),
                  finalize(() => {
                  // this.isLoadingResults = false;
                }))
                .subscribe({
                  next: (ptos: any) => {
                    // Update the album/photo bindings
                    let arreq2 = [];
                    this.filePhotos.forEach(updpto => {
                      arreq2.push(this.odataSvc.assignPhotoToAlbum(alb.Id, updpto.name));
                    });
                    forkJoin(arreq2).subscribe({
                      next: (lik) => {
                        // TBD.
                      },
                      error: (err) => {
                        // TBD.
                      }
                    });
                    this.filePhotos = [];
                    this.fileList = [];
                  },
                  error: (err2: any) => {
                  }
                });
            },
            error: (err : any) => {
              // TBD.
            }
          });
        }
          break;

        default:
          break;
      }
    }
    this.current += 1;
  }

  get nextButtonEnabled(): boolean {
    let isenabled = false;
    switch (this.current) {
      case 0: isenabled = this.fileList.length > 0; break;
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

  getPhotosToBeUpload(): any[] {
    let arreqs = [];
    this.filePhotos.forEach(updpto => {
      let pto = new Photo();
      pto.photoId = updpto.name;
      pto.title = updpto.title;
      pto.desp = updpto.desp;
      pto.orgFileName = updpto.orgName;
      pto.fileUrl = updpto.imgFile;
      pto.thumbnailFileUrl = updpto.thumbFile;
      pto.width = updpto.width;
      pto.height = updpto.height;
      pto.thumbWidth = updpto.thumbWidth;
      pto.thumbWidth = updpto.thumbHeight;
      arreqs.push(this.odataSvc.createPhoto(pto));
    });
    return arreqs;
  }

  done(): void {
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
      pobj.thumbFile = file.response.thumbnailUrl;
      pobj.imgFile = file.response.url;
      pobj.size = file.size.toString();
      pobj.name = file.response.name;
      pobj.width = file.response.width;
      pobj.height = file.response.height;
      pobj.thumbWidth = file.response.thumbwidth;
      pobj.thumbHeight = file.response.thumbheight;

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
