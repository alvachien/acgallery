import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }     from '@angular/http';
import { AppComponent }   from './app.component';
import { routing,
    appRoutingProviders } from './app.routing';

import { AlbumModule }    from './album/album.module';
import { PhotoModule }    from './photo/photo.module';

import { CreditsComponent } from './credits/credits.component';
import { AboutComponent } from './about/about.component';

import { DialogService }  from './dialog.service';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        AlbumModule,
        PhotoModule
    ],
    declarations: [
        AppComponent,
        CreditsComponent,
        AboutComponent
    ],
    providers: [
        appRoutingProviders,
        DialogService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
