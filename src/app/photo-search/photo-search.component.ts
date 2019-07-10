import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, merge, of as observableOf, Subscription, ReplaySubject } from 'rxjs';
import { startWith, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { GeneralFilterValueType, GeneralFilterItem, UIDisplayString, UIDisplayStringUtil,
  GeneralFilterOperatorEnum, Photo, LogLevel } from '../model';
import { PhotoService, UIStatusService } from '../services';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PhotoListPhotoEXIFDialog } from '../photolist';
declare var PhotoSwipe;
declare var PhotoSwipeUI_Default;

@Component({
  selector: 'acgallery-photo-search',
  templateUrl: './photo-search.component.html',
  styleUrls: ['./photo-search.component.scss'],
})
export class PhotoSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean>;

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

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  resultsLength: number;
  public subjFilters: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute,
    private _photoService: PhotoService,
    private _uistatusService: UIStatusService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _media: MediaObserver) {
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

    this.photoAmount = 0;
    this.clnGridCount = 3; // Default
  }

  ngOnInit(): void {
    this._destroyed$ = new ReplaySubject(1);

    this._watcherMedia = this._media.asObservable()
      .pipe(takeUntil(this._destroyed$))
      .subscribe((change: MediaChange[]) => {
      this.activeMediaQuery = change ? `'${change[0].mqAlias}' = (${change[0].mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of PhotoSearchComponent: ${this.activeMediaQuery}`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change[0].mqAlias === 'xs') {
        this.clnGridCount = 1;
      } else if (change[0].mqAlias === 'sm') {
        this.clnGridCount = 2;
      } else if (change[0].mqAlias === 'md') {
        this.clnGridCount = 3;
      } else if (change[0].mqAlias === 'lg') {
        this.clnGridCount = 4;
      } else {
        this.clnGridCount = 6;
      }
    });

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
        takeUntil(this._destroyed$),
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
          if (data && data.totalCount) {
            this.resultsLength = data.totalCount;
            this.photoAmount = data.totalCount;
          }

          return data && data.contentList;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf(undefined);
        }),
    ).subscribe((photolist: any) => {
      this.photos = [];
      if (photolist && photolist instanceof Array) {
        for (const ce of photolist) {
          const pi: Photo = new Photo();
          pi.init(ce);
          this.photos.push(pi);
        }
      }
    }, (error: HttpErrorResponse) => {
      this._snackBar.open('Error occurred: ' + error.message, undefined, {
        duration: 3000,
      });
    }, () => {
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
    this._destroyed$.next(true);
    this._destroyed$.complete();
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
  public onDeletePhoto(photo: any): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering onDeletePhoto of PhotoSearchComponent');
    }

    this._photoService.deletePhoto(photo).subscribe((x: any) => {
      // Do nothing
      let idx = this.photos.findIndex((val: Photo) => {
        return val.photoId === photo.photoId;
      });
      if (idx !== -1) {
        this.photos.splice(idx, 1);
      }
    });
  }
}
