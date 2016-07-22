import { Component, Input } from '@angular/core';
import { Album }            from './album';

@Component({
    selector: 'my-album-detail',
    template: `
    <div *ngIf="album">
      <h2>{{album.title}} Titles!</h2>
      <div><label>id: </label>{{album.id}}</div>
      <div>
        <label>title: </label>
        <input [(ngModel)]="album.title" placeholder="name"/>
      </div>
      <div>
        <label>comment: </label>
        <input [(ngModel)]="album.comment" placeholder="comment"/>
      </div>
    </div>
  `
})

export class AlbumDetailComponent {
    @Input()
    album: Album;
}
