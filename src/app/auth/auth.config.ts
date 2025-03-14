import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment.development';

export const authConfig: PassedInitialConfig = {
  config: {
        authority: environment.IDServerUrl,

        redirectUrl: environment.AppHost, // window.location.origin,
        postLogoutRedirectUri: environment.AppHost, // window.location.origin,

        clientId: 'acgallery.app',
        scope: 'openid profile api.acgallery offline_access',
        responseType: 'code',

        silentRenew: true,
        useRefreshToken: true,
        // renewTimeBeforeTokenExpiresInSeconds: 666,
        // tokenRefreshInSeconds: 600,

        // disableIdTokenValidation: true,
        //ignoreNonceAfterRefresh: true, // this is required if the id_token is not returned
        // allowUnsafeReuseRefreshToken: true, // this is required if the refresh token is not rotated
        //triggerRefreshWhenIdTokenExpired: false, // required to refresh the browser if id_token is not updated after the first authentication
        //autoUserInfo: false, // if the user endpoint is not supported

        renewTimeBeforeTokenExpiresInSeconds: 30,
  }
}
