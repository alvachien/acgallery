import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: environment.IDServerUrl,

            redirectUrl: environment.AppHost,// window.location.origin,
            postLogoutRedirectUri: environment.AppHost, // window.location.origin,

            clientId: 'acgallery.app',
            scope: 'openid profile api.acgallery offline_access',
            responseType: 'code',

            silentRenew: true,
            useRefreshToken: true,
            renewTimeBeforeTokenExpiresInSeconds: 30,
        }
    })],
    exports: [AuthModule],
})
export class AuthConfigModule { }
