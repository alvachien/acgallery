import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { AppComponent }   from './app.component';
import { routing,
    appRoutingProviders } from './app.routing';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AlbumModule }    from './album/album.module';
import { PhotoModule }    from './photo/photo.module';

import { CreditsComponent }     from './about/credits.component';
import { AboutComponent }       from './about/about.component';
import { ForbiddenComponent }   from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DialogService } from './services/dialog.service';
import { BufferService } from './services/buffer.service';
import { AuthService }   from './services/auth.service';
import { HomeComponent }  from './home/home.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/app/locales/', '.json'),
            deps: [Http]
        }),
        MaterialModule.forRoot(),
        FlexLayoutModule.forRoot(),
        AlbumModule,
        PhotoModule
    ],
    declarations: [
        AppComponent,
        CreditsComponent,
        AboutComponent,
        HomeComponent,
        ForbiddenComponent,
        UnauthorizedComponent
    ],
    providers: [
        appRoutingProviders,
        DialogService,
        //LoginService
        AuthService,
        BufferService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
