var gulp = require('gulp'),
   eslint = require('gulp-eslint'),
   concat = require('gulp-concat'),
   babel = require('gulp-babel');

var main = function() {
    
    gulp.task('lint', function(){
        return gulp.src(['src/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());
    });    
    gulp.task('clean-all', function(cb){
        gulp.src('target/*').pipe(rm());
        cb();
    });
    gulp.task('build-js', ['lint', 'clean-all'], function(){
        return gulp.src('src/ChatEnhancer.js')
            .pipe(babel())
            .pipe(gulp.dest('target/lib/'));
    });
    gulp.task('build-chrome-ext', ['build-js'], function(){
    });
    gulp.task('build-cfx-ff', ['build-js'], function(){
    });
    gulp.task('build-all', ['build-chrome-ext']);
    gulp.task('default', ['build-all']);
};

main();
