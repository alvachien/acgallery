import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ReplaySubject, of, Observable } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { EChartOption } from 'echarts';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material';

import { environment } from '../../environments/environment';
import { AuthService } from '../services';
import { LogLevel } from '../model';

@Component({
  selector: 'acgallery-home',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean>;
  private _isLogin: boolean = false;
  private _albumsTop5: any[] = [];
  private _tagsTop5: any[] = [];

  public numberOfColumns: number = 3;
  public featureColumnSpan: number = 2;
  public btnLoginTxt = '';
  public amtAlbum: number;
  public amtPhoto: number;
  public albumChartOption: Observable<EChartOption>;
  public photoChartOption: Observable<EChartOption>;
  public chartTheme: string;

  constructor(private _authService: AuthService,
    private _router: Router,
    private _http: HttpClient,
    private _media: MediaObserver,
    private _snackBar: MatSnackBar,
    private _zone: NgZone) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.info('ACGallery [Debug]: Entering HomeComponent constructor...');
    }
    this.chartTheme = 'light';
  }

  ngOnInit(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.info('ACGallery [Debug]: Entering HomeComponent ngOnInit...');
    }

    this._destroyed$ = new ReplaySubject(1);

    // Login info.
    this._authService.authSubject.pipe(takeUntil(this._destroyed$)).subscribe((x: any) => {
      this._zone.run(() => {
        this._isLogin = x.isAuthorized;
        if (x.isAuthorized) {
          this.btnLoginTxt = 'Login.UserDetail';
        } else {
          this.btnLoginTxt = 'Login.Login';
        }
      });
    }, (error: any) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`ACGallery [Error]: Entering HomeComponent, ngOnInit, subscribe to User: ${error}`);
      }
    }, () => {
      // Completed
    });

    // Statistics info
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    this._http.get(environment.StatisticsAPIUrl, { headers: headers })
      .pipe(takeUntil(this._destroyed$))
      .subscribe((x: any) => {
      this.amtAlbum = x.albumAmount;
      this.amtPhoto = x.photoAmount;
      if (x.photoAmountInTop5Album instanceof Array) {
        const alen: number = x.photoAmountInTop5Album.length;
        for (let i = 0; i < alen; i++) {
          this._albumsTop5.push({
            name: '#' + (i + 1).toString(),
            value: +x.photoAmountInTop5Album[i],
          });
        }
      }
      for (let attr in x.photoAmountInTop5Tag) {
        // console.log(attr);
        this._tagsTop5.push({
          name: attr,
          value: +x.photoAmountInTop5Tag[attr],
        });
      }

      // Build the chart options
      this._buildChartOptions();
    }, (error: HttpErrorResponse) => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.info(`ACGallery [Error]: Entering HomeComponent, failed to fetch statistics data: ${error}`);
      }
      this.amtAlbum = 0;
      this.amtPhoto = 0;

      // Show that info via snackbar
      this._snackBar.open(error.message, undefined, {
        duration: 3000,
      });
    });

    // Register the media change
    this._media.asObservable().pipe(takeUntil(this._destroyed$)).subscribe((change: MediaChange[]) => {
      // this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.info(`ACGallery [Debug]: Entering HomeComponent mediaChange: ${change[0].mqAlias}...`);
      }
      if ( change[0].mqAlias === 'xs') {
        this.numberOfColumns = 1;
        this.featureColumnSpan = 1;
      } else if (change[0].mqAlias === 'sm') {
        this.numberOfColumns = 2;
        this.featureColumnSpan = 1;
      } else if (change[0].mqAlias === 'md') {
        this.numberOfColumns = 3;
        this.featureColumnSpan = 2;
      } else {
        // Large
        this.numberOfColumns = 3;
        this.featureColumnSpan = 2;
      }
    });
  }

  ngOnDestroy(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.info('ACGallery [Debug]: Entering HomeComponent ngOnDestroy...');
    }
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  onLogin(): void {
    if (this._isLogin) {
      this.onUserDetail();
    } else {
      this._authService.doLogin();
    }
  }

  onUserDetail(): void {
    this._router.navigate(['/userdetail']);
  }

  private _buildChartOptions() {
    // Album
    this.albumChartOption = of([]).pipe(
      (map(() => {
        let option: EChartOption = {
          backgroundColor: '#fcf4fc',

          title: {
            text: 'Top 5 Albums',
            left: 'center',
            top: `20`,
            textStyle: {
              color: '#ccc',
            },
          },

          legend: {
            orient: 'vertical',
            x: 'left',
          },

          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}',
          },

          visualMap: [{
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1],
            },
          }],
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this._albumsTop5,
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20,
                },
              },
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    colorStops: [{
                        offset: 0, color: '#fcf4fc',
                    }, {
                        offset: 1, color: '#2cf4ec',
                    }],
                    globalCoord: false,
                  },
                  shadowBlur: 200,
                  shadowColor: 'rgba(200, 0, 0, 0.5)',
                },
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              },
            },
          ],
        };
        return option;
      })));

    // Photo
    this.photoChartOption = of([]).pipe(
      (map(() => {
        let option: EChartOption = {
          backgroundColor: '#fcf4fc',

          title: {
            text: 'Top 5 Tags in Photo',
            left: 'center',
            top: `20`,
            textStyle: {
              color: '#ccc',
            },
          },

          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}',
          },

          legend: {
            orient: 'vertical',
            x: 'left',
          },

          visualMap: [{
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1],
            },
          }],
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this._tagsTop5,
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                },
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20,
                },
              },
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    colorStops: [{
                      offset: 0, color: '#fcf4fc',
                    }, {
                      offset: 1, color: '#d1ff11',
                    }],
                    globalCoord: false,
                  },
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 200, 0, 0.5)',
                },
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              },
            },
          ],
        };
        return option;
      })));
  }
}
