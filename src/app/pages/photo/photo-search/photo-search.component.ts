import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { GeneralFilterItem, GeneralFilterOperatorEnum, GeneralFilterValueType, Photo, UIDisplayString, UIDisplayStringUtil } from 'src/app/models';
import { OdataService } from 'src/app/services';

@Component({
  selector: 'acgallery-photo-search',
  templateUrl: './photo-search.component.html',
  styleUrls: ['./photo-search.component.less'],
})
export class PhotoSearchComponent implements OnInit, AfterViewInit {
  // Filters
  filters: GeneralFilterItem[] = [];
  allOperators: UIDisplayString[] = [];
  allFields: any[] = [];
  filterEditable: boolean = true;
  // Result
  isLoadingResults: boolean = false;
  resultsLength: number;
  public subjFilters: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private odataSvc: OdataService) {
    this.resultsLength = 0;
    this.allOperators = UIDisplayStringUtil.getGeneralFilterOperatorDisplayStrings();
    this.allFields = [{
      displayas: 'Common.Tag',
      value: 'Tags',
      valueType: 2,
    }, {
      displayas: 'Common.CameraMaker',
      value: 'CameraMaker',
      valueType: 2,
    }, {
      displayas: 'Common.CameraModel',
      value: 'CameraModel',
      valueType: 2,
    }, {
      displayas: 'Common.LensModel',
      value: 'LensModel',
      valueType: 2,
    }, {
      displayas: 'Common.ShutterSpeed',
      value: 'ShutterSpeed',
      valueType: 2,
    }, {
      displayas: 'Common.Aperture',
      value: 'AVNumber',
      valueType: 2,
    }, {
      displayas: 'Common.ISO',
      value: 'ISONumber',
      valueType: 1,
    },
    ];
  }

  ngOnInit(): void {
    this.onAddFilter();
  }

  ngAfterViewInit(): void {
    // this.subjFilters.subscribe(() => this.paginator.pageIndex = 0);

    // merge(this.subjFilters, this.paginator.page)
    this.subjFilters
      .pipe(
        // takeUntil(this._destroyed$),
        startWith({}),
        switchMap(() => {
          if (this.subjFilters.value.length <= 0) {
            return observableOf([]);
          }

          this.isLoadingResults = true;

          // return this._photoService.searchPhoto(this.subjFilters.value,
          //   this.paginator.pageSize,
          //   this.paginator.pageIndex * this.paginator.pageSize);
          return this.odataSvc.getPhotos();
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          // this.isLoadingResults = false;
          // if (data && data.totalCount) {
          //   this.resultsLength = data.totalCount;
          //   this.photoAmount = data.totalCount;
          // }

          return data && data.contentList;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf(undefined);
        }),
    ).subscribe({
      next: val => {

      },
      error: err => {
        
      }
    });
    //   (photolist: any) => {
    //   this.photos = [];
    //   if (photolist && photolist instanceof Array) {
    //     for (const ce of photolist) {
    //       const pi: Photo = new Photo();
    //       pi.init(ce);
    //       this.photos.push(pi);
    //     }
    //   }
    // }, (error: HttpErrorResponse) => {
    //   this._snackBar.open('Error occurred: ' + error.message, undefined, {
    //     duration: 3000,
    //   });
    // }, () => {
    //   // Do nothing
    // });

  }

  // Filters
  public onAddFilter(): void {
    this.filters.push(new GeneralFilterItem());
  }
  public onRemoveFilter(idx: number): void {
    this.filters.splice(idx, 1);
    if (this.filters.length === 0) {
      this.onAddFilter();
    }
  }
  public onFieldSelectionChanged(filter: GeneralFilterItem): void {
    this.allFields.forEach((value: any) => {
      if (value.value === filter.fieldName) {
        filter.valueType = value.valueType;
      }
    });
  }

  onSearch() {
    // Do the real search
    // Do the translate first
    let arRealFilter: any[] = [];
    this.filters.forEach((value: GeneralFilterItem) => {
      let val: any = {};
      val.valueType = +value.valueType;
      switch (value.valueType) {
        case GeneralFilterValueType.boolean: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          if (value.value[0]) {
            val.lowValue = 'true';
          } else {
            val.lowValue = 'false';
          }
          val.highValue = '';
          break;
        }

        case GeneralFilterValueType.date: {
          // val.fieldName = value.fieldName;
          // val.operator = +value.operator;
          // val.lowValue = moment(value.lowValue).format('YYYYMMDD');
          // if (value.operator === GeneralFilterOperatorEnum.Between) {
          //   val.highValue = moment(value.highValue).format('YYYYMMDD');
          // } else {
          //   val.highValue = '';
          // }
          break;
        }

        case GeneralFilterValueType.number: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          val.lowValue = +value.value[0];
          if (value.operator === GeneralFilterOperatorEnum.Between) {
            val.highValue = +value.value[1];
          } else {
            val.highValue = '';
          }
          break;
        }

        case GeneralFilterValueType.string: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          val.lowValue = value.value[0];
          if (value.operator === GeneralFilterOperatorEnum.Between) {
            val.highValue = value.value[1];
          } else {
            val.highValue = '';
          }
          break;
        }

        default:
          break;
      }
      arRealFilter.push(val);
    });

    // Do the real search
    this.subjFilters.next(arRealFilter);
  }
}
function observableOf(arg0: undefined[]): any {
  throw new Error('Function not implemented.');
}

