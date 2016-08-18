import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from './album';
import { AlbumService }                     from './album.service';
import { Subscription }                     from 'rxjs/Subscription';

@Component({
    selector: 'my-album-create',
    templateUrl: 'app/views/album/album.create.html'
})

export class AlbumCreateComponent implements OnInit, OnDestroy {
    album: Album = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService) {
        this.album = new Album();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}

