import { Component, OnInit }                from '@angular/core';
import { Photo }                            from './photo';
import { Router, ROUTER_DIRECTIVES }        from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE }   from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'my-photo',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    precompile: [NGB_PRECOMPILE],
    templateUrl: 'app/views/photo/photo.html',
})

export class PhotoComponent implements OnInit {
    title = 'Photos';

    constructor(
        private router: Router) {
    }

    ngOnInit() {
    }
}

