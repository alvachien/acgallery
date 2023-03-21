import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, merge, of as observableOf } from "rxjs";
import { finalize, startWith, switchMap } from "rxjs/operators";

import {
  ConsoleLogTypeEnum,
  GeneralFilterItem,
  GeneralFilterOperatorEnum,
  GeneralFilterValueType,
  Photo,
  UIDisplayString,
  UIDisplayStringUtil,
  writeConsole,
} from "src/app/models";
import { OdataService, UIInfoService } from "src/app/services";
import { PhotoListCoreComponent } from "../../photo-common/photo-list-core";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "acgallery-photo-search",
  templateUrl: "./photo-search.component.html",
  styleUrls: ["./photo-search.component.less"],
})
export class PhotoSearchComponent implements OnInit, AfterViewInit {
  // Filters
  filters: GeneralFilterItem[] = [];
  allOperators: UIDisplayString[] = [];
  allFields: any[] = [];
  filterEditable = true;
  currentAlbumID?: number;
  currentAlbumInfo?: string;
  currentAlbumTitle?: string;
  // Result
  isLoadingResults = false;
  resultsLength: number;
  public subjFilters: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  photos: Photo[] = [];
  pageSize = 20;
  private photoListComponent?: PhotoListCoreComponent;
  // UI
  pageHeader: string;

  @ViewChild(PhotoListCoreComponent) set content(
    content: PhotoListCoreComponent
  ) {
    if (content) {
      // initially setter gets called with undefined
      this.photoListComponent = content;
      this.photoListComponent.paginationEvent.subscribe({
        next: (val: any) => {
          // Do the research
          this.onSearch();
        },
        error: (err: any) => {
          writeConsole(
            `ACGallery [Error]: Entering PhotoSearchComponent content setter ${err.toString()}`,
            ConsoleLogTypeEnum.error
          );
        },
      });
    }
  }

  constructor(
    private odataSvc: OdataService,
    private activateRoute: ActivatedRoute,
    private uiSrv: UIInfoService
  ) {
    this.resultsLength = 0;
    this.allOperators =
      UIDisplayStringUtil.getGeneralFilterOperatorDisplayStrings();
    this.allFields = [
      {
        displayas: "Common.Title",
        value: "Title",
        valueType: 2,
      },
      {
        displayas: "Common.CameraMaker",
        value: "CameraMaker",
        valueType: 2,
      },
      {
        displayas: "Common.CameraModel",
        value: "CameraModel",
        valueType: 2,
      },
      {
        displayas: "Common.LensModel",
        value: "LensModel",
        valueType: 2,
      },
      {
        displayas: "Common.ShutterSpeed",
        value: "ShutterSpeed",
        valueType: 2,
      },
      {
        displayas: "Common.Aperture",
        value: "AVNumber",
        valueType: 2,
      },
      {
        displayas: "Common.ISO",
        value: "ISONumber",
        valueType: 1,
      },
      {
        displayas: "Common.Tags",
        value: "Tags",
        valueType: 2,
      },
    ];

    this.pageHeader = "Common.SearchPhotos";
  }

  ngOnInit(): void {
    this.onAddFilter();

    this.activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        if (x[0].path === "search") {
          this.currentAlbumID = undefined;
          this.pageHeader = "Common.SearchPhotos";
        } else if (x[0].path === "searchinalbum") {
          this.currentAlbumID = +x[1].path;
          if (this.currentAlbumID === +this.uiSrv.AlbumIDForPhotoSearching!) {
            this.currentAlbumInfo = this.uiSrv.AlbumInfoForPhotoSearching;
            this.currentAlbumTitle = this.uiSrv.AlbumTitleForPhotoSearching;
          }
          this.uiSrv.AlbumIDForPhotoSearching = undefined;
          this.uiSrv.AlbumInfoForPhotoSearching = undefined;
          this.uiSrv.AlbumTitleForPhotoSearching = undefined;
          this.pageHeader = "Common.SearchPhotosInAlbum";
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.subjFilters
      .pipe(
        // takeUntil(this._destroyed$),
        startWith({}),
        switchMap(() => {
          if (this.subjFilters.value.length <= 0) {
            return observableOf(undefined);
          }

          this.isLoadingResults = true;

          // Prepare filters
          const filter = this.prepareFilters(this.subjFilters.value);

          return this.odataSvc.searchPhotos(
            this.photoListComponent
              ? (this.photoListComponent.pageIndex - 1) * this.pageSize
              : 0,
            this.pageSize,
            filter,
            this.currentAlbumID,
            this.currentAlbumInfo
          );
        }),
        finalize(() => (this.isLoadingResults = false))
      )
      .subscribe({
        next: (val: any) => {
          if (val === undefined) {
          } else {
            this.resultsLength = val.totalCount;
            this.photos = [];
            for (let i = 0; i < val.items.Length(); i++) {
              this.photos.push(val.items.GetElement(i));
            }
          }
        },
        error: (err) => {
          writeConsole(
            `ACGallery [Error]: Entering PhotoSearchComponent ngAfterViewInit Filter ${err.toString()}`,
            ConsoleLogTypeEnum.error
          );
        },
      });
  }
  prepareFilters(arFilter: any[]): string {
    let rstfilter = "";
    arFilter.sort((a, b) => a.fieldName.localeCompare(b.fieldName));

    arFilter.forEach((flt) => {
      if (
        flt.fieldName === "Title" ||
        flt.fieldName === "CameraModel" ||
        flt.fieldName === "CameraMaker" ||
        flt.fieldName === "LensModel" ||
        flt.fieldName === "Tags"
      ) {
        if (flt.operator === GeneralFilterOperatorEnum.Equal) {
          if (flt.lowValue) {
            rstfilter = rstfilter
              ? `${rstfilter} and ${flt.fieldName} eq '${flt.lowValue}'`
              : `${flt.fieldName} eq '${flt.lowValue}'`;
          } else {
            rstfilter = rstfilter
              ? `${rstfilter} and ${flt.fieldName} eq null`
              : `${flt.fieldName} eq null`;
          }
        } else if (flt.operator === GeneralFilterOperatorEnum.Like) {
          if (flt.lowValue) {
            rstfilter = rstfilter
              ? `${rstfilter} and contains(${flt.fieldName},'${flt.lowValue}')`
              : `contains(${flt.fieldName},'${flt.lowValue}')`;
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
    const arRealFilter: any[] = [];
    this.filters.forEach((value: GeneralFilterItem) => {
      const val: any = {};
      val.valueType = +value.valueType;
      switch (value.valueType) {
        case GeneralFilterValueType.boolean: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          if (value.value[0]) {
            val.lowValue = "true";
          } else {
            val.lowValue = "false";
          }
          val.highValue = "";
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
            val.highValue = "";
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
            val.highValue = "";
          }
          break;
        }

        default:
          break;
      }
      arRealFilter.push(val);
    });

    // Do the real search
    this.subjFilters.next(arRealFilter!);
  }
}
