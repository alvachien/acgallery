import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Injectable()
export class UIStatusService {

  public elemPSWP: any;
  public selPhotoInAblum: any;
  public selPhotoInPhotoList: any;
  isHandset: Observable<BreakpointState>;
  isTablet: Observable<BreakpointState>;
  isWeb: Observable<BreakpointState>;
  isPortrait: Observable<BreakpointState>;
  isLandscape: Observable<BreakpointState>;

  constructor(private breakpointObserver: BreakpointObserver,
    ) {
    this.isHandset = this.breakpointObserver.observe([Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait]);
    this.isTablet = this.breakpointObserver.observe(Breakpoints.Tablet);
    this.isWeb = this.breakpointObserver.observe([Breakpoints.WebLandscape,
      Breakpoints.WebPortrait]);
    this.isPortrait = this.breakpointObserver.observe('(orientation: portrait)');
    this.isLandscape = this.breakpointObserver.observe('(orientation: landscape)');
  }
}
