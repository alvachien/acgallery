import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }     from '@angular/http';
import { AppComponent }   from './app.component';
import { routing,
    appRoutingProviders } from './app.routing';

import { AlbumModule }    from './album/album.module';
import { PhotoModule }    from './photo/photo.module';

import { CreditsComponent }     from './about/credits.component';
import { AboutComponent }       from './about/about.component';
import { ForbiddenComponent }   from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { DialogService }  from './dialog.service';
//import { LoginService }   from './login.service';
import { AuthService }   from './auth.service';
import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent }  from './home/home.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule,
        routing,
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
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
