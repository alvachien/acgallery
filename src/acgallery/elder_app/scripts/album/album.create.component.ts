import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from '../model/album';
import { AlbumService }                     from '../services/album.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../services/dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../services/auth.service';
import { DebugLogging }                     from '../app.setting';
import { MdSnackBar, MdSnackBarConfig }     from '@angular/material';

@Component({
    selector: 'acgallery-album-create',
    templateUrl: 'app/views/album/album.create.html'
})
export class AlbumCreateComponent implements OnInit, OnDestroy {
    album: Album = null;
    curSub: Subscription = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService,
        private dialogService: DialogService,
        private authService: AuthService) {
        if (DebugLogging) {
            console.log("Entering constructor of AlbumCreateComponent");
        }

        this.album = new Album();
    }

    ngOnInit() {
        if (DebugLogging) {
            console.log("Entering ngOnInit of AlbumCreateComponent");
        }

        //if (!this.canCreateAlbum()) {
        //    if (this.authService.authSubject.getValue().getUserName()) {
        //        this.router.navigate(['/unauthorized']);
        //    } else {
        //        this.router.navigate(['/forbidden']);
        //    }
        //}
        //if (!this.curSub) {
        //    this.curSub = this.albumService.curalbum$.subscribe(data => {
        //        this.afterAlbumCreated(data);
        //    });
        //}
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of AlbumCreateComponent");
        }

        if (this.curSub) {
            this.curSub.unsubscribe();
            this.curSub = null;
        }
    }

    onSubmit() {
        if (DebugLogging) {
            console.log("Entering onSubmit of AlbumCreateComponent");
        }

        // Do the basic check
        if (!this.album.Title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }
        this.album.CreatedAt = new Date();
        this.album.CreatedBy = this.authService.authSubject.getValue().getUserName();
        this.albumService.createAlbum(this.album);
    }

    afterAlbumCreated(data: any) {
        // it shall jump to the new created album if possible
        //this.router.navigate(['/album']);
    }

    newAlbum() {
        this.album = new Album();
    }

    canCreateAlbum(): boolean {
        return this.authService.authSubject.getValue().canCreateAlbum();
    }
}

