import { Component, OnInit }    from '@angular/core';
import { CORE_DIRECTIVES }      from '@angular/common';

@Component({
    selector: 'unauthorized',
    template: `<div class="alert alert-danger" role="alert">
        <strong> Oh snap!</strong> You have no authority to perform the action.
        <br />
        Please contact me: 
        <address>
            Alva Chien (<a href= "mailto:alvachien@live.com"> email </a>, <a href="http://www.flickr.com/photos/alvachien">Flickr</a>, etc)
        </address>.
        </div>`,
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
