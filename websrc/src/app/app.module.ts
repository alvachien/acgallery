import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MaterialModule }       from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule, Http }     from '@angular/http';
import { appRoutes, appRoutingProviders } from './app.routing';
import 'hammerjs';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";

import { FileUploadService }    from './services/fileuploadservice';
import { BufferService }        from './services/buffer.service';
import { AuthService }          from './services/auth.service';

import { AlbumModule }          from './album/album.module';
import { PhotoModule }          from './photo/photo.module';
import { AppComponent }         from './app.component';
import { HomeComponent }        from './home/home.component';
import { PortfolioComponent }   from './portfolio/portfolio.component';
import { AboutComponent }       from './about/about.component';

@NgModule({
  imports: [
    MaterialModule.forRoot(),
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/locales/', '.json'),
        deps: [Http]
    }),
    InMemoryWebApiModule.forRoot(FileUploadService),
    AlbumModule,
    PhotoModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    PortfolioComponent,
    AboutComponent
  ],
  providers: [
    BufferService,
    AuthService
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
