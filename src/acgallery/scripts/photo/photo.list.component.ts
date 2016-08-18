import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { Photo }                            from './photo';
import { PhotoService }                     from './photo.service';
import { Subscription }                     from 'rxjs/Subscription';

@Component({
    selector: 'my-photo-list',
    templateUrl: 'app/views/photo/photo.list.html'
})

export class PhotoListComponent implements OnInit, OnDestroy {
    photoes: Photo[];
    errorMessage: any;
    private selectedId: string;
    private sub: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private photoService: PhotoService) {
    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.getPhotos();
            });

        this.getPhotos();
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    getPhotos() {
        this.photoService.getFiles().subscribe(
            photoes => this.photoes = photoes,
            error => this.errorMessage = <any>error
        );
    }
}

