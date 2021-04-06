import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, merge, of as observableOf } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { GeneralFilterItem, GeneralFilterOperatorEnum, GeneralFilterValueType, Photo,
  UIDisplayString, UIDisplayStringUtil } from 'src/app/models';
import { OdataService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { PhotoListCoreComponent } from '../../photo-common/photo-list-core';

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
  photos: Photo[] = [];
  @ViewChild(PhotoListCoreComponent, {static: true}) photoList?: PhotoListCoreComponent;

  constructor(private odataSvc: OdataService) {
    this.resultsLength = 0;
    this.allOperators = UIDisplayStringUtil.getGeneralFilterOperatorDisplayStrings();
    this.allFields = [{
      displayas: 'Common.Title',
      value: 'Title',
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
    }, {
      displayas: 'Common.Tags',
      value: 'Tags',
      valueType: 2,
    },
    ];
  }

  ngOnInit(): void {
    this.onAddFilter();
  }

  ngAfterViewInit(): void {
    // this.subjFilters.subscribe(() => this.paginator.pageIndex = 0);

    // merge(this.subjFilters, this.paginator.page)
    merge(this.subjFilters, this.photoList.paginationEvent)
    //this.subjFilters
      .pipe(
        // takeUntil(this._destroyed$),
        startWith({}),
        switchMap(() => {
          if (this.subjFilters.value.length <= 0) {
            return observableOf(undefined);
          }

          this.isLoadingResults = true;

          // Prepare filters
          let filter = this.prepareFilters(this.subjFilters.value);

          return this.odataSvc.searchPhotos((this.photoList.pageIndex - 1) * this.photoList.pageSize, this.photoList.pageSize, filter);
        }),
        finalize(() => this.isLoadingResults = false),
      ).subscribe({
        next: (val : any) => {
          if (val === undefined) {
          } else {
            this.resultsLength = val.totalCount;
            this.photos = [];
            for(let i = 0; i < val.items.Length(); i++) {
              this.photos.push(val.items.GetElement(i));
            }  
          }
        },
        error: err => {
          console.error(err);
        }
    });
  }
  prepareFilters(arFilter: any[]): string {
    let rstfilter = '';
    arFilter.sort((a, b) => a.fieldName.localeCompare(b.fieldName));

    arFilter.forEach(flt => {
      if (flt.fieldName === 'Title' || flt.fieldName === 'CameraModel' || flt.fieldName === 'CameraMaker' || flt.fieldName === 'LensModel' || flt.fieldName === 'Tags') {
        if (flt.operator === GeneralFilterOperatorEnum.Equal) {
          if (flt.lowValue) {
            rstfilter = rstfilter ? `${rstfilter} and ${flt.fieldName} eq '${flt.lowValue}'` : `${flt.fieldName} eq '${flt.lowValue}'`;
          } else {
            rstfilter = rstfilter ? `${rstfilter} and ${flt.fieldName} eq null` : `${flt.fieldName} eq null`;
          }          
        } else if(flt.operator === GeneralFilterOperatorEnum.Like) {
          if (flt.lowValue) {
            rstfilter = rstfilter ? `${rstfilter} and contains(${flt.fieldName},'${flt.lowValue}')` : `contains(${flt.fieldName},'${flt.lowValue}')`;
          }
        }
      }
    });
    return rstfilter;
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

