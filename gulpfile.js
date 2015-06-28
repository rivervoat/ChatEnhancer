
//hide eslint warnings about require
var require = (require !== undefined) ? require : function(){};

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    browserify = require('gulp-browserify'),
    del = require('del');

var main = function() {

    gulp.task('lint', function(){
        return gulp.src(['src/eg/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());
    });
    gulp.task('clean-all', function(cb){
        del(['target/*'], cb);
    });
    gulp.task('build-js', ['lint', 'clean-all'], function(){
        //this task snippet found on blog of A. Coard
        //http://advantcomp.com/blog/ES6Modules/
        return gulp.src('src/ChatEnhancer.js')
            .pipe(browserify({
                standalone: 'beep'
            }))
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
