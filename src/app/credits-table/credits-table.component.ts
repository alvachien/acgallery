import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { CreditsTableDataSource } from './credits-table-datasource';

@Component({
  selector: 'credits-table',
  templateUrl: './credits-table.component.html',
  styleUrls: ['./credits-table.component.css']
})
export class CreditsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: CreditsTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new CreditsTableDataSource(this.paginator, this.sort);
  }
}
