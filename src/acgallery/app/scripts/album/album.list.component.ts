import { Component, OnInit, OnDestroy,
    NgZone }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from './album';
import { AlbumService }                     from './album.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../auth.service';

@Component({
    selector: 'my-album-list',
    templateUrl: 'app/views/album/album.list.html'
})

export class AlbumListComponent implements OnInit, OnDestroy {
    private selectedId: number;
    private sub: Subscription;
    albumes: Album[];
    errorMessage: any;
    public selectedAlbum: Album;

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService,
        private dialogService: DialogService,
        private authService: AuthService) {
    }

    isSelected(album: Album) {
        return album.Id === this.selectedId;
    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = +params['id'];
                this.albumService.getAlbums()
                    .subscribe(albums => this.zone.run(() => {
                        this.albumes = albums;
                    }));
            });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onSetSelect(album: Album) {
        this.selectedAlbum = album;
    }

    onSaveAlbumMetadata() {
        // Verify the title and desp
        if (!this.selectedAlbum.Title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }

        this.albumService.updateMetadata(this.selectedAlbum).subscribe(x => {
            if (x) {
                //this.onViewAlbumDetail(this.selectedAlbum);
                this.dialogService.log("Updated successfully!", "success");
            } else {
                this.dialogService.log("Updated failed!", "error");
            }            
        });
    }

    onViewAlbumDetail(album: Album) {
        // Navigate with Absolute link
        // If there is accessCode, requires it.
        if (album.AccessCode ) {
            // Popup the dialog
            let strAccessCode: string = "";
            let that = this;
            this.dialogService.prompt("Input the Access Code", strAccessCode, function (val: any, event: any) {
                console.log("Clicked with new value: " + val);

                event.preventDefault();

                // verify the access code
                that.router.navigate(['/album/detail', album.Id]);
            }, function (event: any) {
                event.preventDefault();
                console.log("Cancelled !");
            });
        } else {
            //this.router.navigate(['/album/detail', album.Id]);
        }        
    }

    onOrgAlbumPhoto(album: Album) {
        this.router.navigate(['/album/orgphoto', album.Id]);
    }

    canChangeAlbum(album: Album): boolean {
        return this.authService.authSubject.getValue().canChangeAlbum(album.CreatedBy);
    }
}

