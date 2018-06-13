import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialog, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, merge, of as observableOf, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { GeneralFilterValueType, GeneralFilterItem, UIDisplayString, UIDisplayStringUtil,
  GeneralFilterOperatorEnum, Photo, LogLevel } from '../model';
import { PhotoService, UIStatusService } from '../services';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { PhotoListPhotoEXIFDialog } from '../photolist';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photo-search',
  templateUrl: './photo-search.component.html',
  styleUrls: ['./photo-search.component.scss'],
})
export class PhotoSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  filters: GeneralFilterItem[] = [];
  allOperators: UIDisplayString[] = [];
  allFields: any[] = [];
  filterEditable: boolean = true;
  public photos: Photo[] = [];
  public photoAmount: number;
  public selectedPhoto: Photo = null;
  private gallery: any = null;
  pageSize = 20;
  pageSizeOptions = [20, 40, 60, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // Layout
  clnGridCount: number;
  private _watcherMedia: Subscription;
  activeMediaQuery = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  resultsLength: number;
  public subjFilters: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute,
    private _photoService: PhotoService,
    private _uistatusService: UIStatusService,
    private _dialog: MatDialog,
    private _media: ObservableMedia) {
    this.resultsLength = 0;
    this.allOperators = UIDisplayStringUtil.getGeneralFilterOperatorDisplayStrings();
    this.allFields = [{
      displayas: 'Common.Tag',
      value: 'Tags',
      valueType: 2,
    },
    ];

    this.photoAmount = 0;
    this.clnGridCount = 3; // Default

    this._watcherMedia = this._media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of PhotoSearchComponent: ${this.activeMediaQuery}`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change.mqAlias === 'xs') {
        this.clnGridCount = 1;
      } else if (change.mqAlias === 'sm') {
        this.clnGridCount = 2;
      } else if (change.mqAlias === 'md') {
        this.clnGridCount = 3;
      } else if (change.mqAlias === 'lg') {
        this.clnGridCount = 4;
      } else {
        this.clnGridCount = 6;
      }
    });
  }

  ngOnInit(): void {
    this.onAddFilter();
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    this.subjFilters.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.subjFilters, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if (this.subjFilters.value.length <= 0) {
            return observableOf([]);
          }

          this.isLoadingResults = true;

          return this._photoService.searchPhoto(this.subjFilters.value,
            this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize);
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.totalCount;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        }),
    ).subscribe(() => {
      // Do nothing
    });
  }

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
  public onSearch(): void {
    // Do the translate first
    let arRealFilter: any[] = [];
    this.filters.forEach((value: GeneralFilterItem) => {
      let val: any = {};
      val.valueType = +value.valueType;
      switch (value.valueType) {
        case GeneralFilterValueType.boolean: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          if (value.lowValue) {
            val.lowValue = 'true';
          } else {
            val.lowValue = 'false';
          }
          val.highValue = '';
          break;
        }

        case GeneralFilterValueType.date: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          val.lowValue = moment(value.lowValue).format('YYYYMMDD');
          if (value.operator === GeneralFilterOperatorEnum.Between) {
            val.highValue = moment(value.highValue).format('YYYYMMDD');
          } else {
            val.highValue = '';
          }
          break;
        }

        case GeneralFilterValueType.number: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          val.lowValue = +value.lowValue;
          if (value.operator === GeneralFilterOperatorEnum.Between) {
            val.highValue = +value.highValue;
          } else {
            val.highValue = '';
          }
          break;
        }

        case GeneralFilterValueType.string: {
          val.fieldName = value.fieldName;
          val.operator = +value.operator;
          val.lowValue = value.lowValue;
          if (value.operator === GeneralFilterOperatorEnum.Between) {
            val.highValue = value.highValue;
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

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();
  }

  onPhotoClick(idx: number): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onPhotoClick of PhotoSearchComponent');
    }

    if (this.photos.length <= 0) {
      return;
    }

    const items = [];
    for (const pht of this.photos) {
      items.push({
        src: pht.fileInAPIUrl,
        w: pht.width,
        h: pht.height,
      });
    }

    let idx2: number;
    if (!idx) {
      idx2 = 0;
    } else if (idx < 0 || idx > this.photos.length) {
      idx2 = 0;
    } else {
      idx2 = idx;
    }

    // define options (if needed)
    const options: any = {
      history: false,
      focus: false,

      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: idx2, // start at first slide
    };

    // Initializes and opens PhotoSwipe
    this.gallery = new PhotoSwipe(this._uistatusService.elemPSWP, PhotoSwipeUI_Default, items, options);
    this.gallery.init();
  }

  onViewPhotoEXIFDialog(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onViewPhotoEXIFDialog of PhotoSearchComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;

    const dialogRef = this._dialog.open(PhotoListPhotoEXIFDialog);
    dialogRef.afterClosed().subscribe((result: any) => {
      this._uistatusService.selPhotoInPhotoList = null;
    });
  }

  public onDisplayPhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onDisplayPhoto of PhotoSearchComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/display']);
  }

  public onChangePhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onChangePhoto of PhotoSearchComponent');
    }

    this._uistatusService.selPhotoInPhotoList = photo;
    this._router.navigate(['/photo/edit']);
  }
}
