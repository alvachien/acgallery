
import {
    Component, OnInit, OnDestroy, NgZone }   from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Album }                  from '../model/album';
import { AlbumService }           from '../services/album.service';
import { DialogService }          from '../services/dialog.service';
import { Observable }             from 'rxjs/Observable';
import { Subscription }           from 'rxjs/Subscription';
import { Photo }                  from '../model/photo';
import { PhotoService }           from '../services/photo.service';
import { AuthService }            from '../services/auth.service';
import '../rxjs-operators';
import { DebugLogging }           from '../app.setting';
declare var $: any;
//import 'jquery';
//import 'fancybox';

@Component({
    selector: 'acgallery-album-detail',
    templateUrl: 'app/views/album/album.detail.html'
})

export class AlbumDetailComponent implements OnInit, OnDestroy {
    public album: Album;
    public photos: Photo[];
    public selectedPhoto: Photo;
    private subCurAlbum: Subscription;
    private subAlbumPhotos: Subscription;
    private routerID: number = -1;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        public dialogService: DialogService,
        private albumService: AlbumService,
        private photoService: PhotoService,
        private authService: AuthService) {
        if (DebugLogging) {
            console.log("Entering constructor of AlbumDetailComponent");
        }        
    }

    ngOnInit() {
        if (DebugLogging) {
            console.log("Entering ngOnInit of AlbumDetailComponent");
        }

        if (!this.subCurAlbum) {
            this.subCurAlbum = this.albumService.curalbum$.subscribe(data => this.getCurrentAlbumData(data),
                error => this.handleError(error));
        }
        if (!this.subAlbumPhotos) {
            this.subAlbumPhotos = this.photoService.photosByAlbum$.subscribe(data => this.getCurrentAlbumPhotos(data),
                error => this.handleError(error));
        }

        let aid: number = -1;
        this.route.params.forEach((next: { id: number }) => {
            aid = next.id;
        });

        if (aid !== -1 && aid != this.routerID) {
            this.routerID = aid;
            this.albumService.loadAlbum(aid);
        }
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of AlbumDetailComponent");
        }

        if (this.subCurAlbum) {
            this.subCurAlbum.unsubscribe();
            this.subCurAlbum = null;
        }
        if (this.subAlbumPhotos) {
            this.subAlbumPhotos.unsubscribe();
            this.subAlbumPhotos = null;
        }
    }

    getCurrentAlbumData(album: Album) {
        if (DebugLogging) {
            console.log("Entering getCurrentAlbumData of AlbumDetailComponent");
        }

        this.zone.run(() => {
            this.album = album;
        });

        if (album.AccessCode) {
            let strAccessCode: string = "";
            let that = this;

            this.dialogService.prompt("Input the Access Code", strAccessCode, function (val: any, event: any) {
                console.log("Clicked with new value: " + val);

                event.preventDefault();
                that.photoService.loadAlbumPhoto(album.Id, val);
            }, function (event: any) {
                event.preventDefault();
                console.log("Cancelled !");
            });
        } else {
            this.photoService.loadAlbumPhoto(album.Id);
        }
    }

    getCurrentAlbumPhotos(data: any) {
        if (DebugLogging) {
            console.log("Entering getCurrentAlbumPhotos of AlbumDetailComponent");
        }

        this.zone.run(() => {
            this.photos = data;
        });

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
    }

    handleError(error: any) {
        if (DebugLogging) {
            console.log("Entering handleError of AlbumDetailComponent");
        }

        console.log(error);
        if (error.status === 401) {
            this.dialogService.confirm("Unauthorized! It most likely you input an WRONG access code!");
        }
    }

    gotoAlbumes() {
        if (DebugLogging) {
            console.log("Entering gotoAlbumes of AlbumDetailComponent");
        }

        let albumid = this.album ? this.album.Id : null;
        this.router.navigate(['/album', { id: albumid, foo: 'foo' }]);
    }

    onSetSelectedPhoto(photo: Photo) {
        this.selectedPhoto = photo;
    }

    onSavePhotoMetadata() {
        if (DebugLogging) {
            console.log("Entering onSavePhotoMetadata of AlbumDetailComponent");
        }

        // Verify the title and desp
        if (!this.selectedPhoto.title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }

        this.photoService.updateFileMetadata(this.selectedPhoto).subscribe(x => {
            if (x) {
                // Navigate to the albums list page
                this.dialogService.log("Metadata updated successfully!", "success");
            } else {
                this.dialogService.log("Metadata updated failed!", "error");
            }
        });
    }

    canChangeAlbum(album): boolean {
        return this.authService.authSubject.getValue().canChangeAlbum(album.CreatedBy);
    }
}
