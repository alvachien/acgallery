import { Component, OnInit }                from '@angular/core';
import { Photo }                            from './photo';
import { PhotoService }                     from './photo.service';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE }   from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'my-photo-list',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    precompile: [NGB_PRECOMPILE],
    templateUrl: 'app/views/photo/photo.list.html',
    providers: [
        PhotoService
    ],
})

export class PhotoListComponent implements OnInit {
    photoes: Photo[];

    constructor(
        private router: Router,
        private photoService: PhotoService) {
    }

    ngOnInit() {
    }
}

