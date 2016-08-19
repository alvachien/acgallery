import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from './album';
import { AlbumService }                     from './album.service';
import { Subscription }                     from 'rxjs/Subscription';

@Component({
    selector: 'my-album-list',
    templateUrl: 'app/views/album/album.list.html'
})

export class AlbumListComponent implements OnInit, OnDestroy {
    private selectedId: number;
    private sub: Subscription;
    albumes: Album[];
    errorMessage: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService) {
    }

    isSelected(album: Album) {
        return album.Id === this.selectedId;
    }

    getAlbumes() {
        this.albumService.getAlbums().subscribe(
            albumes => this.albumes = albumes,
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = +params['id'];
                this.albumService.getAlbums()
                    .subscribe(albums => this.albumes = albums);
            });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    onSelect(album: Album) {
        // Navigate with Absolute link
        this.router.navigate(['/album/detail', album.Id]);
    }
}

