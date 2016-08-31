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
        private dialogService: DialogService,
        private authService: AuthService) {
        this.album = new Album();
    }

    ngOnInit() {
        if (!this.canCreateAlbum()) {
            if (this.authService.authSubject.getValue().getUserName()) {
                this.router.navigate(['/unauthorized']);
            } else {
                this.router.navigate(['/forbidden']);
            }
        }
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
        this.album.CreatedBy = this.authService.authSubject.getValue().getUserName();        
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

    canCreateAlbum(): boolean {
        return this.authService.authSubject.getValue().canCreateAlbum();
    }
}

