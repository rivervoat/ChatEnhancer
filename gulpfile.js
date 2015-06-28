
var main = function() {
    var gulp = require('gulp'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        babel = require('gulp-babel');

    gulp.task('build-js', function(){
        return gulp.src('src/ChatEnhancer.js')
            .pipe(babel())
            .pipe(gulp.dest('build'));
    });
    gulp.task('build-chrome-ext', function(){
        
    });
    gulp.task('build-cfx-ff', function(){
    });
    gulp.task('clean-all',function(){
        
    });
    gulp.task('build-all', ['lint','build-js', 'build-chrome-ext']);
};

main();
