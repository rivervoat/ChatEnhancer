var gulp = require('gulp'),
    jshint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel');

var main = function() {

    gulp.task('lint', function(){
        return gulp.src(['src/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());        
        
    });
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
    gulp.task('default', ['build-all']);
};

main();
