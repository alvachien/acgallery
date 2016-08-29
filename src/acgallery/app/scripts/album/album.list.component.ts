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
        private dialogService: DialogService) {
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
                this.dialogService.confirm("Updated successfully!");
            }
        });
    }

    onViewAlbumDetail(album: Album) {
        // Navigate with Absolute link
        this.router.navigate(['/album/detail', album.Id]);
    }

    onOrgAlbumPhoto(album: Album) {
        this.router.navigate(['/album/orgphoto', album.Id]);
    }
}

