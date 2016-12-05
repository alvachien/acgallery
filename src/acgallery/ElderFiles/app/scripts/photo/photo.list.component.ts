import { Component, OnInit, OnDestroy,
    NgZone  }                               from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Photo }                            from '../model/photo';
import { PhotoService }                     from '../services/photo.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../services/dialog.service';
import { AuthService }                      from '../services/auth.service';
import { DebugLogging }                     from '../app.setting';
import '../rxjs-operators';
import { UIPagination }                     from '../utility/paginated';
// To avoid load the files twice
declare var $: any;
//import 'jquery';
//import 'fancybox';

@Component({
    selector: 'acgallery-photo-list',
    templateUrl: 'app/views/photo/photo.list.html'
})
export class PhotoListComponent implements OnInit, OnDestroy {
    public photos: Photo[] = [];
    public errorMessage: any;
    //private subPhotos: Subscription = null;
    public selectedPhoto: Photo = null;
    private objUtil: UIPagination = null;

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private photoService: PhotoService,
        private dialogService: DialogService,
        private authService: AuthService) {
        if (DebugLogging) {
            console.log("Entering constructor of PhotoListComponent");
        }

        this.objUtil = new UIPagination(15, 5);
    }

    ngOnInit() {
        if (DebugLogging) {
            console.log("Entering ngOnInit of PhotoListComponent");
        }

        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (item) {
                    return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                }
            }
        });

        //if (!this.subPhotos) {
        //    this.subPhotos = this.photoService.photos$.subscribe(data => this.onPhotoLoaded(data),
        //        error => this.onHandleError(error));

        //    this.photoService.loadPhotos(true);
        //}
        this.onPageClick(1);
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of PhotoListComponent");
        }

        //if (this.subPhotos) {
        //    this.subPhotos.unsubscribe();
        //    this.subPhotos = null;
        //}
    }

    onPagePreviousClick() {
        if (DebugLogging) {
            console.log("Entering onPagePreviousClick of PhotoListComponent");
        }

        if (this.objUtil.currentPage > 1) {
            this.onPageClick(this.objUtil.currentPage - 1);
        }
    }

    onPageNextClick() {
        if (DebugLogging) {
            console.log("Entering onPageNextClick of PhotoListComponent");
        }

        this.onPageClick(this.objUtil.currentPage + 1);
    }

    onPageClick(pageIdx: number) {
        if (DebugLogging) {
            console.log("Entering onPageClick of PhotoListComponent");
        }

        if (this.objUtil.currentPage != pageIdx) {
            this.objUtil.currentPage = pageIdx;

            let paraString = this.objUtil.nextAPIString;
            this.photoService.loadPhotosex(paraString).subscribe(data => {
                if (DebugLogging) {
                    console.log("Photos loaded successfully of PhotoListComponent");
                }

                this.objUtil.totalCount = data.totalCount;
                this.zone.run(() => {
                    this.photos = [];
                    if (data && data.contentList && data.contentList instanceof Array) {
                        this.photos = data.contentList;
                    }
                });
            }, error => {
                if (DebugLogging) {
                    console.log("Error occurred during photo loading of PhotoListComponent");
                    console.log(error);
                }
            }, () => {
                if (DebugLogging) {
                    console.log("Photos loaded completed of PhotoListComponent");
                }
            });
        }
    }

    //onPhotoLoaded(photos) {
    //    if (DebugLogging) {
    //        console.log("Entering onPhotoLoaded of PhotoListComponent");
    //    }

    //    this.zone.run(() => {
    //        this.photos = photos;
    //    });
    //}

    onHandleError(error) {
        if (DebugLogging) {
            console.log("Entering onHandleError of PhotoListComponent");
        }

        this.errorMessage = <any>error;
    }

    onSetSelectedPhoto(photo: Photo) {
        if (DebugLogging) {
            console.log("Entering onSetSelectedPhoto of PhotoListComponent");
        }

        this.selectedPhoto = photo;
    }

    onSavePhotoMetadata() {
        if (DebugLogging) {
            console.log("Entering onSavePhotoMetadata of PhotoListComponent");
        }

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
        if (DebugLogging) {
            console.log("Entering onAssignAlbum of PhotoListComponent");
        }

        this.router.navigate(['/photo/assignalbum', photo.photoId]);
    }

    canChangePhoto(pto: Photo): boolean {
        return this.authService.authSubject.getValue().canChangePhoto(pto.uploadedBy);
    }
}

