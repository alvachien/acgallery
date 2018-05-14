import { Component, OnInit, Input } from '@angular/core';
import { Album, UIMode } from '../model';

@Component({
  selector: 'acgallery-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss'],
})
export class AlbumDetailComponent implements OnInit {
  @Input()
  objAlbum: Album;
  @Input()
  uiMode: UIMode;

  constructor() { }

  get isFieldChangable(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }
  get needShowAccessCode(): boolean {
    return this.uiMode === UIMode.Create || this.uiMode === UIMode.Change;
  }

  ngOnInit() {
  }
}
