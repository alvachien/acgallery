import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import 'oidc-client';

import { AuthService } from './services/auth.service';
import { PhotoService } from './services/photo.service';
import { AlbumService } from './services/album.service';
import { UIStatusService } from './services/uistatus.service';
import { AuthGuard } from './services/authguard.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AlbumComponent, AlbumAccessCodeDialog, AlbumPhotoEXIFDialog } from './album/album.component';
import { AlbumlistComponent } from './albumlist/albumlist.component';
import { PhotouploadComponent } from './photoupload/photoupload.component';
import { PhotochangeComponent } from './photochange/photochange.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PhotolistComponent, PhotoListPhotoEXIFDialog } from './photolist/photolist.component';
import { AboutComponent } from './about/about.component';
import { CreditsComponent } from './credits/credits.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export function funcHttpLoaderFactory(http: Http) {
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
    HomeComponent,
    PagenotfoundComponent,
    PhotolistComponent,
    PhotoListPhotoEXIFDialog,
    AboutComponent,
    CreditsComponent,
    UnauthorizedComponent,
    PhotochangeComponent
  ],
  entryComponents: [
    AlbumAccessCodeDialog,
    AlbumPhotoEXIFDialog,
    PhotoListPhotoEXIFDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: funcHttpLoaderFactory,
            deps: [Http]
        }
    }),
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    TranslateService,
    PhotoService,
    AlbumService,
    UIStatusService,
    AuthGuard,
    CanDeactivateGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
