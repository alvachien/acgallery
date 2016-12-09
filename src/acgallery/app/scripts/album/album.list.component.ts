import { Component, OnInit, OnDestroy,
    NgZone }                                from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Album }                            from '../model/album';
import { AlbumService }                     from '../services/album.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../services/dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../services/auth.service';
import { DebugLogging }                     from '../app.setting';

@Component({
    selector: 'acgallery-album-list',
    templateUrl: 'app/views/album/album.list.html'
})
export class AlbumListComponent implements OnInit, OnDestroy {
    private selectedId: number;
    private subAlbums: Subscription;
    private subCurAlbum: Subscription;
    public albumes: Album[];
    public errorMessage: any;
    public selectedAlbum: Album;

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private albumService: AlbumService,
        private dialogService: DialogService,
        private authService: AuthService) {
        if (DebugLogging) {
            console.log("Entering constructor of AlbumListComponent");
        }        
    }

    isSelected(album: Album) {
        return album.Id === this.selectedId;
    }

    ngOnInit() {
        if (DebugLogging) {
            console.log("Entering ngOnInit of AlbumListComponent");
        }
        if (!this.subAlbums) {
            this.subAlbums = this.albumService.albums$.subscribe(data => this.onAlbumLoaded(data),
                error => this.onHandleError(error));

            this.albumService.loadAlbums();        
        }

        if (!this.subCurAlbum) {
            this.subCurAlbum = this.albumService.curalbum$.subscribe(data => this.onCurrentAlbum(data),
                error => this.onHandleError(error));
        }
    }

    ngOnDestroy() {
        if (DebugLogging) {
            console.log("Entering ngOnDestroy of AlbumListComponent");
        }        

        if (this.subAlbums) {
            this.subAlbums.unsubscribe();
            this.subAlbums = null;
        }
        if (this.subCurAlbum) {
            this.subCurAlbum.unsubscribe();
            this.subCurAlbum = null;
        }
    }

    onAlbumLoaded(data) {
        if (DebugLogging) {
            console.log("Entering onAlbumLoaded of AlbumListComponent");
        }        

        this.zone.run(() => {
            this.albumes = data;
        });
    }

    onCurrentAlbum(data) {
        if (DebugLogging) {
            console.log("Entering onCurrentAlbum of AlbumListComponent");
        }        
        // Todo
    }

    onHandleError(error) {
        if (DebugLogging) {
            console.log("Entering onHandleError of AlbumListComponent");
        }        
        console.log(error);
    }

    onSetSelect(album: Album) {
        this.selectedAlbum = album;
    }

    onSaveAlbumMetadata() {
        if (DebugLogging) {
            console.log("Entering onSaveAlbumMetadata of AlbumListComponent");
        }        

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
        if (DebugLogging) {
            console.log("Entering onViewAlbumDetail of AlbumListComponent");
        }        
        this.router.navigate(['/album/detail', album.Id]);
    }

    onOrgAlbumPhoto(album: Album) {
        if (DebugLogging) {
            console.log("Entering onOrgAlbumPhoto of AlbumListComponent");
        }        
        this.router.navigate(['/album/orgphoto', album.Id]);
    }

    canChangeAlbum(album: Album): boolean {
        return this.authService.authSubject.getValue().canChangeAlbum(album.CreatedBy);
    }
}

