import { Component, OnInit }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Album }                  from './album';
import { AlbumService }           from './album.service';
import { DialogService }          from '../dialog.service';
import { Observable }             from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/common';
import { Photo }                  from '../photo/photo';
import { PhotoService }           from '../photo/photo.service';

@Component({
    selector: 'my-album-orgphoto',
    templateUrl: 'app/views/album/album.orgphoto.html'
})

export class AlbumOrgPhotoComponent implements OnInit {
    public album: Album;
    public allPhotos: Photo[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dialogService: DialogService,
        private albumService: AlbumService,
        private photoService: PhotoService) {
    }

    ngOnInit() {
        //this.route.data.forEach((data: { album: Album }) => {
        //    this.album = data.album;
        //});
        this.route.params.forEach((next: { id: number }) => {
            this.albumService.getAlbum(next.id).subscribe(album => this.album = album);
        });
        this.photoService.getFiles().subscribe(photos => this.allPhotos = photos);
    }

    gotoAlbumes() {
        let albumid = this.album ? this.album.Id : null;
        // Pass along the hero id if available
        // so that the CrisisListComponent can select that hero.
        // Add a totally useless `foo` parameter for kicks.
        // Absolute link
        this.router.navigate(['/album', { id: albumid, foo: 'foo' }]);
    }
}
