import { Component, OnInit, OnDestroy,
    NgZone  }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Photo }                            from './photo';
import { PhotoService }                     from './photo.service';
import { Subscription }                     from 'rxjs/Subscription';
import { DialogService }                    from '../dialog.service';
import '../rxjs-operators';
import { AuthService }                      from '../auth.service';

@Component({
    selector: 'my-photo-list',
    templateUrl: 'app/views/photo/photo.list.html'
})

export class PhotoListComponent implements OnInit, OnDestroy {
    public photos: Photo[];
    public errorMessage: any;
    private sub: Subscription;
    public selectedPhoto: Photo;

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private photoService: PhotoService,
        private dialogService: DialogService,
        private authService: AuthService) {
    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.getPhotos();
            });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    getPhotos() {
        this.photoService.getFiles().subscribe(
            photos => this.zone.run(() => {
                    this.photos = photos;
                    }),
            error => this.errorMessage = <any>error
        );
    }

    onSetSelectedPhoto(photo: Photo) {
        this.selectedPhoto = photo;
    }

    onSavePhotoMetadata() {
        // Verify the title and desp
        if (!this.selectedPhoto.title) {
            this.dialogService.confirm("Title is a must!");
            return;
        }

        this.photoService.updateFileMetadata(this.selectedPhoto).subscribe(x => {
            if (x) {
                // Navigate to the albums list page
                //this.router.navigate(['/photo']);
                this.dialogService.confirm("Updated successfully!");
            }
        });
    }

    onAssignAlbum(photo) {
        this.router.navigate(['/photo/assignalbum', photo.photoId]);
    }

    canChangePhoto(pto: Photo): boolean {
        return this.authService.authSubject.getValue().canChangePhoto(pto.uploadedBy);
    }
}

