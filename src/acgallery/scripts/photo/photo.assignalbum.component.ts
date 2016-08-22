import { Component, OnInit }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Album }                  from '../album/album';
import { AlbumService }           from '../album/album.service';
import { DialogService }          from '../dialog.service';
import { Observable }             from 'rxjs/Observable';
import { FormBuilder, Validators } from '@angular/common';
import { Photo }                  from './photo';
import { PhotoService }           from './photo.service';
import '../rxjs-operators';

@Component({
    selector: 'my-photo-assignalbum',
    templateUrl: 'app/views/photo/photo.assign.html'
})

export class PhotoAssignAlbumComponent implements OnInit {
    public photoid: string;
    public allAlbum: Album[];
    public assignedAlbum: Album[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dialogService: DialogService,
        private albumService: AlbumService,
        private photoService: PhotoService) {
    }

    ngOnInit() {
        this.route.params.forEach((next: { photoid: string }) => {
            this.photoid = next.photoid;

            Observable.forkJoin(
                this.albumService.getAlbums(),
                this.albumService.getAlbumsContainsPhoto(this.photoid)
            ).subscribe(res => {
                this.allAlbum = res[0];
                this.assignedAlbum = res[1];

                if (this.assignedAlbum.length > 0) {
                    for (let i = 0; i < this.assignedAlbum.length; i++) {                        
                        let foundIdx = -1;
                        for (let j = 0; j < this.allAlbum.length; j++) {
                            if (this.allAlbum[j].Id === this.assignedAlbum[i].Id) {
                                foundIdx = j;
                                break;
                            }
                        }

                        if (foundIdx != -1) {
                            this.allAlbum.splice(foundIdx, 1);
                        }
                    }
                }
            });
        });
    }
}
