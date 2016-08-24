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
    bower: './bower_components/',

    tsSource: './app/scripts/**/*.ts',
    tsOutput: app + 'js/',

    cssApp: app + 'css/',
    viewsApp: app + 'views/',

    jsVendors: lib + 'js/',
    cssVendors: lib + 'css/',
    imgVendors: lib + 'img/',
    fontsVendors: lib + 'fonts/'
};

var tsProject = ts.createProject('app/scripts/tsconfig.json');

gulp.task('setup-vendors', function (done) {
    gulp.src([
        'fancybox/dist/js/jquery.fancybox.pack.js',
        'core-js/client/**',
        'systemjs/dist/system.src.js',
        'reflect-metadata/*.js',
        'rxjs/**/*.js',
        'zone.js/dist/*.js',
        '@angular/**/*.js',
        '@ng-bootstrap/ng-bootstrap/**/*.js',
        'angular2-in-memory-web-api/**/*.js',
        'ng2-file-upload/**/*.js',
        'jquery/dist/jquery*.js',
        'bootstrap/dist/js/bootstrap*.js',
        'tether/dist/js/tether*.js'
        ], {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest(paths.jsVendors));

    gulp.src([
        'alertify.js/lib/alertify.min.js',
        ], {
            cwd: "bower_components/**"
        })
        .pipe(gulp.dest(paths.jsVendors));

    gulp.src([
      paths.npm + 'tether/dist/css/tether*.css',
      paths.npm + 'bootstrap/dist/css/bootstrap.css',
      paths.npm + 'fancybox/dist/css/jquery.fancybox.css',
      paths.bower + 'font-awesome/css/font-awesome.css',
      paths.bower + 'alertify.js/themes/alertify.core.css',
      paths.bower + 'alertify.js/themes/alertify.bootstrap.css',
      paths.bower + 'alertify.js/themes/alertify.default.css'
    ]).pipe(gulp.dest(paths.cssVendors));

    gulp.src([
      paths.npm + 'fancybox/dist/img/blank.gif',
      paths.npm + 'fancybox/dist/img/fancybox_loading.gif',
      paths.npm + 'fancybox/dist/img/fancybox_loading@2x.gif',
      paths.npm + 'fancybox/dist/img/fancybox_overlay.png',
      paths.npm + 'fancybox/dist/img/fancybox_sprite.png',
      paths.npm + 'fancybox/dist/img/fancybox_sprite@2x.png'
    ]).pipe(gulp.dest(paths.imgVendors));

    gulp.src([
      paths.bower + 'bootstrap/fonts/glyphicons-halflings-regular.eot',
      paths.bower + 'bootstrap/fonts/glyphicons-halflings-regular.svg',
      paths.bower + 'bootstrap/fonts/glyphicons-halflings-regular.ttf',
      paths.bower + 'bootstrap/fonts/glyphicons-halflings-regular.woff',
      paths.bower + 'bootstrap/fonts/glyphicons-halflings-regular.woff2',
      paths.bower + 'font-awesome/fonts/FontAwesome.otf',
      paths.bower + 'font-awesome/fonts/fontawesome-webfont.eot',
      paths.bower + 'font-awesome/fonts/fontawesome-webfont.svg',
      paths.bower + 'font-awesome/fonts/fontawesome-webfont.ttf',
      paths.bower + 'font-awesome/fonts/fontawesome-webfont.woff',
      paths.bower + 'font-awesome/fonts/fontawesome-webfont.woff2',
    ]).pipe(gulp.dest(paths.fontsVendors));
});

gulp.task('setup-environment', function (done) {
    gulp.src([
      'systemjs.config.js',
      'app/index.html',
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
