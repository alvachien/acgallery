import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.less'],
})
export class PhotoListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onUpload(): void {
    this.router.navigate(['/photo/upload']);
  }
}
