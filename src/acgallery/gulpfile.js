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
    localeApp: app + 'locales/',
    imgApp: app + 'imgs/',

    jsVendors: lib + 'js/',    
    cssVendors: lib + 'css/',
    imgVendors: lib + 'imgs/',
    fontsVendors: lib + 'fonts/'
};

var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('setup-vendors-js', function () {
    gulp.src([
        'core-js/client/*.js',
        'systemjs/dist/system*.js',
        'rxjs/**/*.js',
        'zone.js/dist/*.js',
        '@angular/**/*.js',
        'ng2-translate/**/*.js',
        'oidc-client/dist/*.js',
        ], {
            cwd: "node_modules/**"
        })
        .pipe(gulp.dest(paths.jsVendors));
});

gulp.task('setup-vendors-css', function () {
});

gulp.task('setup-vendors-font', function () {
});

gulp.task('setup-vendors', ['setup-vendors-js' ]);

gulp.task('setup-environment', function (done) {
    gulp.src([
      'systemjs.config.js',
      'app/index.html',
      'app/logincallback.html',
      'app/logoutcallback.html',
      "app/resources/favicon.ico",
      "app/resources/grey.jpg"
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

gulp.task('build-locales', function () {
    gulp.src([
        'app/locales/**/*.json'
    ]).pipe(gulp.dest(paths.localeApp));
});

gulp.task('build-img', function () {
    gulp.src([
        'app/imgs/**/*.*'
    ]).pipe(gulp.dest(paths.imgApp));
});

gulp.task('compile-typescript', function (done) {
    //var tsResult = tsProject.src() // instead of gulp.src(...) 
    //        .pipe(ts(tsProject));

    //return tsResult.js.pipe(gulp.dest(paths.tsOutput));

    // Current version
    //var tsResult = gulp.src([
    //   "app/scripts/**/*.ts"
    //])
    // .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());
    //return tsResult.js.pipe(gulp.dest(paths.tsOutput));

    var tsResult = gulp.src([
       "app/scripts/**/*.ts"
    ])
     .pipe(tsProject(), undefined, ts.reporter.fullReporter());
    return tsResult.js.pipe(gulp.dest(paths.tsOutput));

});

gulp.task('clean-lib', function () {
    return del([lib]);
});
gulp.task('clean-app', function () {
    return del([app]);
});

gulp.task('build-clean', ['clean-lib', 'clean-app']);

gulp.task('build', function () {
    runSequence('build-clean',
              ['setup-vendors', 'setup-environment', 'build-view', 'build-css', 'build-locales', 'build-img', 'compile-typescript']);
});
