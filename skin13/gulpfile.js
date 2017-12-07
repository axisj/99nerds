'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');

var CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var ASSETS_FRONT = CONFIG["front-assets"];
var AX5UI_PATH = CONFIG["ax5uiPath"];
var AX5UI_PLUGINS_FRONT = {

};

function errorAlert(error) {
  notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
}

/**
 * JS
 */
gulp.task('plugin-js-front', function () {
  var jss = [
    ASSETS_FRONT + '/plugins/jquery/dist/jquery.js',
    ASSETS_FRONT + '/plugins/materialize_edited/adeptor.js'
  ];

  for (var k in AX5UI_PLUGINS_FRONT) {
    jss.push(ASSETS_FRONT + '/plugins/' + k + '/dist/' + AX5UI_PLUGINS_FRONT[k] + '.js');
  }

  gulp.src(jss)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sourcemaps.init())
    .pipe(concat('front-plugins.js'))
    .pipe(gulp.dest(ASSETS_FRONT + '/js'))
    .pipe(concat('front-plugins.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(ASSETS_FRONT + '/js'));
});

gulp.task('materialize-js-front', function () {
  gulp.src(ASSETS_FRONT + '/plugins/materialize_edited/js/*.js')
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sourcemaps.init())
    .pipe(concat('materialize.js'))
    .pipe(gulp.dest(ASSETS_FRONT + '/plugins/materialize_edited/dist'))
    .pipe(concat('materialize.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(ASSETS_FRONT + '/plugins/materialize_edited/dist'));
});

/**
 * SASS
 */
gulp.task('front-scss', function () {
  gulp.src(ASSETS_FRONT + '/scss/front.scss')
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sass({outputStyle: 'compressed'}))
    //.pipe(sass({outputStyle: 'nested'}))
    .pipe(gulp.dest(ASSETS_FRONT + '/css'));
});


/**
 * default
 */
gulp.task('default', function () {
  // SASS
  gulp.watch(ASSETS_FRONT + '/scss/**/*.scss', ['front-scss']);
  gulp.watch(ASSETS_FRONT + '/plugins/materialize_edited/js/*.js', ['materialize-js-front']);
});