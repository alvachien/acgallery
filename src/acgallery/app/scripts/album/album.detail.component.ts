/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/fancybox/index.d.ts" />

import {
    Component, OnInit, NgZone }   from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Album }                  from './album';
import { AlbumService }           from './album.service';
import { DialogService }          from '../dialog.service';
import { Observable }             from 'rxjs/Observable';
import { Photo }                  from '../photo/photo';
import { PhotoService }           from '../photo/photo.service';
import { AuthService }            from '../auth.service';
import '../rxjs-operators';
declare var $: any;
//import 'jquery';
//import 'fancybox';

@Component({
    selector: 'my-album-detail',
    templateUrl: 'app/views/album/album.detail.html'
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public selectedPhoto: Photo;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        public dialogService: DialogService,
        private albumService: AlbumService,
        private photoService: PhotoService,
        private authService: AuthService) {
    }

    ngOnInit() {
        //this.route.data.forEach((data: { album: Album }) => {
        //    this.album = data.album;
        //});
        this.route.params.forEach((next: { id: number }) => {
            this.albumService.getAlbum(next.id).subscribe(
                album => {
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
                });
        });
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
