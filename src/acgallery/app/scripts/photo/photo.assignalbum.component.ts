import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Album, SelectableAlbum,
    AlbumPhotoByPhoto }           from '../album/album';
import { AlbumService }           from '../album/album.service';
import { DialogService }          from '../dialog.service';
import { Observable }             from 'rxjs/Observable';
import { Photo }                  from './photo';
import { PhotoService }           from './photo.service';
import '../rxjs-operators';
import { AuthService }            from '../auth.service';

@Component({
    selector: 'my-photo-assignalbum',
    templateUrl: 'app/views/photo/photo.assign.html'
})

export class PhotoAssignAlbumComponent implements OnInit {
    public photoid: string;
    public allAlbum: SelectableAlbum[];
    public assignedAlbum: SelectableAlbum[];

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
        this.route.params.forEach((next: { photoid: string }) => {
            this.photoid = next.photoid;

            Observable.forkJoin(
                this.albumService.getAlbums(),
                this.albumService.getAlbumsContainsPhoto(this.photoid)
            ).subscribe(res => {
                var all = res[0];
                var assigned = res[1];

                if (assigned.length > 0) {
                    for (let i = 0; i < assigned.length; i++) {                        
                        let foundIdx = -1;
                        for (let j = 0; j < all.length; j++) {
                            if (all[j].Id === assigned[i].Id) {
                                foundIdx = j;
                                break;
                            }
                        }

                        if (foundIdx != -1) {
                            all.splice(foundIdx, 1);
                        }
                    }
                }

                this.zone.run(() => {
                    this.assignedAlbum = new Array<SelectableAlbum>();
                    this.allAlbum = new Array<SelectableAlbum>();
                    for (let k = 0; k < assigned.length; k++) {
                        var alb = <SelectableAlbum>assigned[k];
                        this.assignedAlbum.push(alb);
                    }

                    for (let k = 0; k < all.length; k++) {
                        var alb = <SelectableAlbum>all[k];
                        this.allAlbum.push(alb);
                    }
                });
            });
        });
    }

    onAddAssignedAlbum() {
        let tmpAlbum = new Array<SelectableAlbum>();
        for (let i = this.allAlbum.length - 1; i >= 0; i--) {
            if (this.allAlbum[i].IsSelected) {
                tmpAlbum.push(this.allAlbum[i]);
                this.allAlbum.splice(i, 1);
            }
        }
        if (tmpAlbum.length > 0) {
            for (let k = 0; k < tmpAlbum.length; k++) {
                this.assignedAlbum.push(tmpAlbum[k]);
            }            
        }
    }

    onRemoveAssignedAlbum() {
        let tmpAlbum = new Array<SelectableAlbum>();
        for (let i = this.assignedAlbum.length - 1; i >= 0; i--) {
            if (this.assignedAlbum[i].IsSelected) {
                tmpAlbum.push(this.assignedAlbum[i]);
                this.assignedAlbum.splice(i, 1);
            }
        }
        if (tmpAlbum.length > 0) {
            for (let k = 0; k < tmpAlbum.length; k++) {
                this.allAlbum.push(tmpAlbum[k]);
            }
        }
    }

    onSubmit() {
        let apba = new AlbumPhotoByPhoto();
        apba.PhotoID = this.photoid;
        apba.AlbumIDList = new Array<number>();
        for (let i = 0; i < this.assignedAlbum.length; i++) {
            apba.AlbumIDList.push(this.assignedAlbum[i].Id);
        }
        this.albumService.updateAlbumPhotoByPhoto(apba).subscribe(
            x => {
                if (x) {
                    this.dialogService.log("Save successfully", "success");
                    this.router.navigate(['/photo']);
                } else {
                    this.dialogService.log("Save failed", "error");
                }
            }
        );
    }

    onCancel() {
        this.router.navigate(['/photo']);
    }
}
