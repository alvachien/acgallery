/// <binding AfterBuild='build' Clean='clean-lib' />
var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    fs = require("fs"),
    del = require('del'),
    path = require('path'),
    runSequence = require('run-sequence');;

var lib = "./wwwroot/libs/";
var app = "./wwwroot/app/";

var paths = {
    npm: './node_modules/',

    tsSource: './app/scripts/**/*.ts',
    tsOutput: app + 'js/',

    cssApp: app + 'css/',
    viewsApp: app + 'views/',

    jsVendors: lib + 'js/',    
    cssVendors: lib + 'css/',
    imgVendors: lib + 'img/',
    fontsVendors: lib + 'fonts/'
};

var tsProject = ts.createProject('tsconfig.json');

gulp.task('setup-vendors-js', function () {
    gulp.src([
        'core-js/client/*.js',
        'systemjs/dist/system*.js',
        'reflect-metadata/*.js',
        'rxjs/**/*.js',
        'zone.js/dist/*.js',
        '@angular/**/*.js',
        'moment/min/*.js',
        'ng2-bootstrap/**/*.js',
        'angular2-in-memory-web-api/**/*.js',
        'ng2-file-upload/**/*.js',
        'jquery/dist/jquery*.js',
        'bootstrap/dist/js/bootstrap*.js',
        'tether/dist/js/tether*.js',
        'oidc-client/dist/*.js',
        'alertify.js/dist/js/*.js',
        'photoswipe/dist/**/*.js'
        ], {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest(paths.jsVendors));

    gulp.src([
        'app/libs/fancyBox/*.js',
       ])
        .pipe(gulp.dest(paths.jsVendors + 'fancyBox/'));
});

gulp.task('setup-vendors-css', function () {
    gulp.src([
      paths.npm + 'tether/dist/css/tether*.css',
      paths.npm + 'bootstrap/dist/css/bootstrap.css',
      paths.npm + 'font-awesome/css/font-awesome*.css',
      paths.npm + 'photoswipe/dist/photoswipe.css',
      paths.npm + 'photoswipe/dist/**/*.css'
    ]).pipe(gulp.dest(paths.cssVendors));

    gulp.src([
        'app/libs/fancyBox/*.css',
    ])
    .pipe(gulp.dest(paths.cssVendors));
});

gulp.task('setup-vendors-img', function () {
    gulp.src([
      paths.npm + 'photoswipe/dist/**/*.png',
      paths.npm + 'photoswipe/dist/**/*.gif'
    ]).pipe(gulp.dest(paths.fontsVendors));
});

gulp.task('setup-vendors-font', function () {
    gulp.src([
      paths.npm + 'font-awesome/fonts/FontAwesome.otf',
      paths.npm + 'font-awesome/fonts/fontawesome-webfont.eot',
      paths.npm + 'font-awesome/fonts/fontawesome-webfont.svg',
      paths.npm + 'font-awesome/fonts/fontawesome-webfont.ttf',
      paths.npm + 'font-awesome/fonts/fontawesome-webfont.woff',
      paths.npm + 'font-awesome/fonts/fontawesome-webfont.woff2',
      paths.npm + 'photoswipe/dist/**/*.svg',
    ]).pipe(gulp.dest(paths.fontsVendors));
});

gulp.task('setup-vendors', ['setup-vendors-js', 'setup-vendors-css', 'setup-vendors-img', 'setup-vendors-font']);

gulp.task('setup-environment', function (done) {
    gulp.src([
      'systemjs.config.js',
      'app/index.html',
      'app/logincallback.html',
      'app/logoutcallback.html',
      "favicon.ico"
    ]).pipe(gulp.dest('./wwwroot/'));
});

gulp.task('build-view', function () {
    gulp.src([
        'app/views/**/*.html'
    ]).pipe(gulp.dest(paths.viewsApp));
});

gulp.task('build-css', function () {
    gulp.src([
        'app/css/**/*.css'
    ]).pipe(gulp.dest(paths.cssApp));
});

gulp.task('compile-typescript', function (done) {
    //var tsResult = tsProject.src() // instead of gulp.src(...) 
    //        .pipe(ts(tsProject));

    //return tsResult.js.pipe(gulp.dest(paths.tsOutput));
    var tsResult = gulp.src([
       "app/scripts/**/*.ts"
    ])
     .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());
    return tsResult.js.pipe(gulp.dest(paths.tsOutput));
});

gulp.task('watch.views', ['before-compile-view'], function () {
    return gulp.watch('app/views/*.html', ['before-compile-view']);
});
gulp.task('watch.css', ['before-compile-css'], function () {
    return gulp.watch('app/css/*.css', ['before-compile-css']);
});

gulp.task('watch.ts', ['compile-typescript'], function () {
    return gulp.watch('app/scripts/**/*.ts', ['compile-typescript']);
});

gulp.task('watch', ['watch.ts', 'watch.views', 'watch.css']);

gulp.task('clean-lib', function () {
    return del([lib]);
});
gulp.task('clean-app', function () {
    return del([app]);
});

gulp.task('build-clean', ['clean-lib', 'clean-app']);

gulp.task('build', function () {
    runSequence('build-clean',
              ['setup-vendors', 'setup-environment', 'build-view', 'build-css', 'compile-typescript']);
});
