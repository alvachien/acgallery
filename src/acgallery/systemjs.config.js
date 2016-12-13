/**
 * System configuration for Angular 2 app
 * Reference: https://github.com/angular/quickstart
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'lib:': 'libs/js/'
        },
        map: {
            'app': 'app/js', // 'dist',

            // angular bundles
            '@angular/core': 'lib:@angular/core/bundles/core.umd.js',
            '@angular/common': 'lib:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'lib:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'lib:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'lib:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'lib:@angular/http/bundles/http.umd.js',
            '@angular/router': 'lib:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'lib:@angular/forms/bundles/forms.umd.js',
            '@angular/material': 'lib:@angular/material/material.umd.js',

            // other libraries
            'rxjs': 'lib:rxjs',
            'ng2-translate': 'lib:ng2-translate/bundles/index.js',
            'oidc-client': 'lib:oidc-client/dist/oidc-client.min.js'
        },
        packages: {
            'app': {
                main: './main.js',
                format: 'register',
                defaultExtension: 'js'
            },
            'rxjs': {
                defaultExtension: 'js'
            }
        }
    });
})(this);