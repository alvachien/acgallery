import { Component, OnInit }        from '@angular/core';
import { Album }            from './album';
import { Router } from '@angular/router';
import { AlbumService } from './album.service';

@Component({
    selector: 'my-album',
    templateUrl: 'app/views/album.html',
    styleUrls: ['app/css/album.component.css'],
    providers: [
        AlbumService
    ]
})

export class AlbumComponent implements OnInit {
    title = 'Photo Albums';
    selectedAlbum: Album;
    albumes: Album[];

    constructor(
        private router: Router,
        private albumService: AlbumService) { }

    getAlbumes() {
        this.albumService.getMockedData().then(albumes => this.albumes = albumes);
    }

    ngOnInit() {
        this.getAlbumes();
    }

    onSelect(album: Album) { this.selectedAlbum = album; }

    gotoDetail() {
        this.router.navigate(['/detail', this.selectedAlbum.id]);
    }
}

