import { Injectable }             from '@angular/core';
import { Router, Resolve,
    ActivatedRouteSnapshot }      from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { Album }                  from './album';
import { AlbumService }           from './album.service';

@Injectable()
export class AlbumDetailResolve implements Resolve<Album> {
    constructor(private cs: AlbumService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        let id = +route.params['id'];

        return this.cs.getAlbum(id).subscribe(album => {
            if (album) {
                return album;
            } else { // id not found
                this.router.navigate(['/album']);
                return false;
            }
        });
    }
}
