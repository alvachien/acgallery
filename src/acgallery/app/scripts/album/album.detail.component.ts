/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/fancybox/index.d.ts" />

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
declare var $: any;
//import 'jquery';
//import 'fancybox';

@Component({
    selector: 'my-album-detail',
    templateUrl: 'app/views/album/album.detail.html'
})

export class AlbumDetailComponent implements OnInit, OnDestroy {
    public album: Album;
    public selectedPhoto: Photo;
    private subCurAlbum: Subscription;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        public dialogService: DialogService,
        private albumService: AlbumService,
        private photoService: PhotoService,
        private authService: AuthService) {
        
        this.subCurAlbum = this.albumService.curalbum$.subscribe(data => this.getCurrentAlbumData(data),
            error => this.handleError(error));
    }

    ngOnInit() {
        this.route.params.forEach((next: { id: number }) => {
            this.albumService.loadAlbum(next.id);
        });
    }

    ngOnDestroy() {
        if (this.subCurAlbum) {
            this.subCurAlbum.unsubscribe();
        }
    }

    getCurrentAlbumData(album: any) {
        if (album.AccessCode) {
            let strAccessCode: string = "";
            let that = this;

            this.dialogService.prompt("Input the Access Code", strAccessCode, function (val: any, event: any) {
                console.log("Clicked with new value: " + val);

                event.preventDefault();

                // verify the access code

                //that.router.navigate(['/album/detail', album.Id]);
                this.zone.run(() => {
                    this.album = album;
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

            }, function (event: any) {
                event.preventDefault();
                console.log("Cancelled !");
            });
        }
    }
    handleError(error: any) {
        console.log(error);
    }

    gotoAlbumes() {
        let albumid = this.album ? this.album.Id : null;
        this.router.navigate(['/album', { id: albumid, foo: 'foo' }]);
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
