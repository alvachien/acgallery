import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { AppRoutingModule } from './app-routing.module';

import { AuthService, PhotoService, AlbumService, UIStatusService, AuthGuard, CanDeactivateGuardService, UserDetailService } from './services';
import { SplitAreaDirective, SplitHandleDirective, SplitDirective, IsOddWithEvenAllowedDirective,
  DateIsEndOfMonthDirective, } from './directives';
import { TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AlbumComponent, AlbumAccessCodeDialog, AlbumPhotoEXIFDialog } from './album/album.component';
import { AlbumlistComponent } from './albumlist/albumlist.component';
import { PhotouploadComponent, PhotoRenamingDialog, PhotoAddTagsDialog } from './photoupload/photoupload.component';
import { PhotochangeComponent } from './photochange/photochange.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PhotolistComponent, PhotoListPhotoEXIFDialog } from './photolist/photolist.component';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AlbumDetailComponent } from './album-detail';
import { UserDetailComponent } from './user-detail';
import { PhotoSearchComponent } from './photo-search';
import { OperatorFilterPipe } from './pipes';
import { TagCloudComponent } from './tag-cloud';
import { RatingInputComponent } from './rating-input';
import { NgxEchartsModule } from 'ngx-echarts';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

registerLocaleData(zh);

export function funcHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AlbumComponent,
    AlbumAccessCodeDialog,
    AlbumPhotoEXIFDialog,
    AlbumlistComponent,
    PhotouploadComponent,
    PhotoRenamingDialog,
    PhotoAddTagsDialog,
    HomeComponent,
    PagenotfoundComponent,
    PhotolistComponent,
    PhotoListPhotoEXIFDialog,
    AboutComponent,
    CreditsComponent,
    UnauthorizedComponent,
    PhotochangeComponent,
    AlbumDetailComponent,
    SplitAreaDirective,
    SplitHandleDirective,
    SplitDirective,
    UserDetailComponent,
    PhotoSearchComponent,
    OperatorFilterPipe,
    TagCloudComponent,
    RatingInputComponent,
    DateIsEndOfMonthDirective,
    IsOddWithEvenAllowedDirective,
  ],
  entryComponents: [
    AlbumAccessCodeDialog,
    AlbumPhotoEXIFDialog,
    PhotoListPhotoEXIFDialog,
    PhotoRenamingDialog,
    PhotoAddTagsDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    CdkTableModule,
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: funcHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    FlexLayoutModule,
    AppRoutingModule,
    LayoutModule,
    NgxEchartsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  providers: [
    AuthService,
    TranslateService,
    PhotoService,
    AlbumService,
    UIStatusService,
    AuthGuard,
    CanDeactivateGuardService,
    UserDetailService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: zh_CN },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
