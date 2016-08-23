import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    private usrMgr: any;
    private currentUser: any;

    constructor() {
        let settings = {
            authority: "http://localhost:1861",
            client_id: "spa",
            redirect_uri: "http://localhost:1861/spa/callback.html",
            response_type: "id_token token",
            scope: "openid profile api.todo"
        };

        //var mgr = new Oidc.UserManager(settings);
        //mgr.getUser().then(function (u) {
        //    if (u) {
        //        user = u;
        //    }
        //    else {
        //    }
        //});    
    }
}
