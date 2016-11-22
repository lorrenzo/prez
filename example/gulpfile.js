'use strict';

var _ = require('lodash');
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    webpack = require('webpack-stream');

// import de la conf webpack pour le bundle des js
var webpackConfig = require('./webpack.config.gulp');

function mario(error) {
    gutil.log(error.message);
    this.emit('end');
}

gulp.task('js', function () {
    return gulp.src('./src/javascript/**/*.ts')
        .pipe(plumber(mario))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./src/dist/'));
});

gulp.task('less', function () {
    return gulp.src('./src/styles/**/*.less')
        .pipe(plumber(mario))
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ './src/styles']
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Chrome >= 49']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./src/dist/'));
});

// watch files
gulp.task('watch',  function () {

    // css
    gulp.watch('./src/styles/**/*.less', ['less'])
        .on('change', function (event) {
            gutil.log(gutil.colors.cyan('File ' + event.path + ' was ' + event.type + ', running tasks...'));
        });

    // js
    gulp.watch('./src/javascript/**/*.ts', ['js'])
        .on('change', function (event) {
            gutil.log(gutil.colors.cyan('File ' + event.path + ' was ' + event.type + ', running tasks...'));
        });
});

// watch files
gulp.task('compile', ['less','js']);

