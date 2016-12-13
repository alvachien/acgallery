/// <binding AfterBuild='build' Clean='clean-lib' />
const gulp  = require('gulp'),
    sass    = require('gulp-sass'),
    ts      = require('gulp-typescript'),
    fs      = require("fs"),
    del     = require('del'),
    path    = require('path'),
    runSequence = require('run-sequence');

var lib = "./wwwroot/libs/";
var app = "./wwwroot/app/";
var srcRoot = "./app/";

var paths = {
    npm: './node_modules/',

    srcCode: srcRoot + 'scripts/**/*.ts',
    srcView: srcRoot + 'views/**/*.html',
    srcScss: srcRoot + 'scss/**/*.scss',
    srcLocales: srcRoot + 'locales/**/*.json',
    srcImgs: srcRoot + 'imgs/**/*.*',

    jsApp: app + 'js/',
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
    ]).pipe(gulp.dest('./wwwroot/'));
});

gulp.task('build-view', function () {
    gulp.src(paths.srcView).pipe(gulp.dest(paths.viewsApp));
});

gulp.task('build-sass', function () {
    return gulp.src(paths.srcScss)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(paths.cssApp));
});

//gulp.task('sass:watch', function () {
//    gulp.watch('./sass/**/*.scss', ['sass']);
//});

gulp.task('build-locales', function () {
    gulp.src(paths.srcLocales).pipe(gulp.dest(paths.localeApp));
});

gulp.task('build-img', function () {
    gulp.src(paths.srcImgs).pipe(gulp.dest(paths.imgApp));
});

gulp.task('compile-typescript', function (done) {
    var tsResult = gulp.src(paths.srcCode)
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
              ['setup-vendors', 'setup-environment', 'build-view', 'build-scss', 'build-locales', 'build-img', 'compile-typescript']);
});
