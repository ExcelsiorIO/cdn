var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('default', ['watch'], function() {
});

gulp.task('test', function () {
    gulp.src('test', {read: false})
        .pipe(mocha({
            reporter: 'nyan'
        }))
        .on('error', function (err) {
            this.emit('end');
        });
});

gulp.task('watch', ['test'], function () {
    gulp.watch(
        ['server.js', 'test/*.js'],
        ['test']
    );
});