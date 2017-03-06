import { Component, OnInit } from '@angular/core';
import { Album }             from '../../model/album';

@Component({
  selector: 'album-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public album: Album = null;
  
  constructor() { 
    this.album = new Album();
  }

  ngOnInit() {
  }
}
