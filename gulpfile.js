const gulp = require('gulp');

const paths = {
    config: 'config/*',

    build: 'build/config/'
}

gulp.task('copy-config', function () {
    return gulp.src(paths.config).pipe(gulp.dest(paths.build));
});