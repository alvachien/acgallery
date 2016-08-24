import { Component, OnInit }    from '@angular/core';
import { CORE_DIRECTIVES }      from '@angular/common';

@Component({
    selector: 'unauthorized',
    template: '<div>401: You have no rights to access this. Please Login</div>',
    directives: [CORE_DIRECTIVES]
})

export class UnauthorizedComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = "UnauthorizedComponent constructor";
    }

    ngOnInit() {
    }
}
