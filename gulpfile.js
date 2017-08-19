'use strict'

const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const babel = require('gulp-babel')
const rename = require('gulp-rename')

const APP = 'app.js'
const DEST = './'
const FINAL = 'main.js'

gulp.task('babel', function () {
  return gulp.src(APP)
    .pipe(babel({
            presets: ['env']
          }))
    .pipe(rename(FINAL))
    .pipe(gulp.dest(DEST))
})

gulp.task('nodemon', ['babel'], function () {
  nodemon({script: DEST + '/' + FINAL})
})

gulp.task('watch', function () {
  gulp.watch(APP, ['babel'])
})

gulp.task('default', ['nodemon', 'watch'])
