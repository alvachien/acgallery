import { Component, OnInit }                from '@angular/core';
import { Album }                            from './album';
import { AlbumService }                     from './album.service';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE }   from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'my-album-list',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    precompile: [NGB_PRECOMPILE],
    templateUrl: 'app/views/album/album.list.html',
    providers: [
        AlbumService
    ],
})

export class AlbumListComponent implements OnInit {
    selectedAlbum: Album;
    albumes: Album[];

    constructor(
        private router: Router,
        private albumService: AlbumService) {
    }

    getAlbumes() {
        this.albumService.getMockedData().then(albumes => this.albumes = albumes);
    }

    ngOnInit() {
        this.getAlbumes();
    }

    onSelect(album: Album) { this.selectedAlbum = album; }

    gotoDetail() {
        this.router.navigate(['/albumdetail', this.selectedAlbum.Id]);
    }
}

