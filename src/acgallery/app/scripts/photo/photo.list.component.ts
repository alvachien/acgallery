/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/fancybox/index.d.ts" />

import { Component, OnInit, OnDestroy,
    NgZone  }                               from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Photo }                            from '../model/photo';
import { PhotoService }                     from '../services/photo.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../services/dialog.service';
import { AuthService }                      from '../services/auth.service';
import '../rxjs-operators';
// To avoid load the files twice
declare var $: any;
//import 'jquery';
//import 'fancybox';

@Component({
    selector: 'my-photo-list',
    templateUrl: 'app/views/photo/photo.list.html'
})

export class PhotoListComponent implements OnInit, OnDestroy {
    public photos: Photo[];
    public errorMessage: any;
    private subPhotos: Subscription;
    public selectedPhoto: Photo;

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private photoService: PhotoService,
        private dialogService: DialogService,
        private authService: AuthService) {
    }

    ngOnInit() {
        this.subPhotos = this.photoService.photos$.subscribe(data => this.onPhotoLoaded(data),
            error => this.onHandleError(error));

        this.photoService.loadPhotos();
    }

    ngOnDestroy() {
        if (this.subPhotos) {
            this.subPhotos.unsubscribe();
        }
    }

    onPhotoLoaded(photos) {
        this.zone.run(() => {
            this.photos = photos;
        });

        $("[rel='fancybox-thumb']").fancybox({
            openEffect: 'drop',
            closeEffect: 'drop',
            nextEffect: 'elastic',
            prevEffect: 'elastic',
            helpers: {
                thumbs: true
            }
        });
    }

    onHandleError(error) {
        this.errorMessage = <any>error;
    }

    onSetSelectedPhoto(photo: Photo) {
        this.selectedPhoto = photo;
    }

    onSavePhotoMetadata() {
        // Verify the title and desp
        if (!this.selectedPhoto.title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }

        this.photoService.updateFileMetadata(this.selectedPhoto).subscribe(
            uploadrst => {
                if (uploadrst) {
                    // Navigate to the albums list page
                    //this.router.navigate(['/photo']);
                    this.dialogService.log("Updated successfully!", "success");
                } else {
                    this.dialogService.log("Updated failed!", "error");
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    onAssignAlbum(photo) {
        this.router.navigate(['/photo/assignalbum', photo.photoId]);
    }

    canChangePhoto(pto: Photo): boolean {
        return this.authService.authSubject.getValue().canChangePhoto(pto.uploadedBy);
    }
}

