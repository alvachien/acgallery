import { Component, Input }                 from '@angular/core';
import { Photo }                            from './photo';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE }   from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'my-photo-detail',
    templateUrl: 'app/views/photo/photo.detail.html',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    precompile: [NGB_PRECOMPILE],
})

export class PhotoDetailComponent {
    @Input()
    photo: Photo;
}
