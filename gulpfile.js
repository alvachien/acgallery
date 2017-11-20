var gulp = require('gulp');

var paths = {
    dist: 'dist/',
    wwwroot: '../src/acgallery/wwwroot/'
};

gulp.task('copy', function(){

    gulp.src([
        paths.dist + '*.js',
        paths.dist + '*.html',
        paths.dist + '*.map',
        paths.dist + '*.svg',
        paths.dist + 'assets/**'
        ], {base: 'dist/'})
        .pipe(gulp.dest(paths.wwwroot));
});
