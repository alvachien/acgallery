import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from './album';
import { AlbumService }                     from './album.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../auth.service';

@Component({
    selector: 'my-album-create',
    templateUrl: 'app/views/album/album.create.html'
})

export class AlbumCreateComponent implements OnInit, OnDestroy {
    album: Album = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService,
        private dialogService: DialogService) {
        this.album = new Album();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onSubmit() {
        // Do the basic check
        if (!this.album.Title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }
        this.album.CreatedAt = new Date();
        this.album.CreatedBy = "Tester";        
        this.albumService.createAlbum(this.album).subscribe(x => {
            if (x) {
                // Navigate to the albums list page
                this.router.navigate(['/album']);
            }
        });
    }

    newAlbum() {
        this.album = new Album();
    }
}

