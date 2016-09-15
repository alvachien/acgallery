import { Component, OnInit, OnDestroy,
    NgZone }                                from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from '../model/album';
import { AlbumService }                     from '../services/album.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../services/dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../services/auth.service';

@Component({
    selector: 'my-album-list',
    templateUrl: 'app/views/album/album.list.html'
})

export class AlbumListComponent implements OnInit, OnDestroy {
    private selectedId: number;
    private subAlbums: Subscription;
    private subCurAlbum: Subscription;
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
        this.subAlbums = this.albumService.albums$.subscribe(data => this.onAlbumLoaded(data),
            error => this.onHandleError(error));

        this.subCurAlbum = this.albumService.curalbum$.subscribe(data => this.onCurrentAlbum(data),
            error => this.onHandleError(error));

        this.albumService.loadAlbums();        
    }

    ngOnDestroy() {
        if (this.subAlbums) {
            this.subAlbums.unsubscribe();
        }
    }

    onAlbumLoaded(data) {
        this.zone.run(() => {
            this.albumes = data;
        });
    }

    onCurrentAlbum(data) {
        // Todo
    }

    onHandleError(error) {
        console.log(error);
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

        //this.albumService.updateMetadata(this.selectedAlbum).subscribe(x => {
        //    if (x) {
        //        //this.onViewAlbumDetail(this.selectedAlbum);
        //        this.dialogService.log("Updated successfully!", "success");
        //    } else {
        //        this.dialogService.log("Updated failed!", "error");
        //    }            
        //});
    }

    onViewAlbumDetail(album: Album) {
        this.router.navigate(['/album/detail', album.Id]);
    }

    onOrgAlbumPhoto(album: Album) {
        this.router.navigate(['/album/orgphoto', album.Id]);
    }

    canChangeAlbum(album: Album): boolean {
        return this.authService.authSubject.getValue().canChangeAlbum(album.CreatedBy);
    }
}

