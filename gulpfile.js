const gulp = require('gulp');
var del = require('del');

const paths = {
    config: 'config/*',

    build: 'build/config/'
}

gulp.task('copy-config', function () {
    return gulp.src(paths.config).pipe(gulp.dest(paths.build));
});

gulp.task('clean', function(){
    return del(['build/', 'coverage/', 'logs/'], {force:true});
});