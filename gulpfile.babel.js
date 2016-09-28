import gulp from 'gulp'
import postcss from 'gulp-postcss'
import pug from 'gulp-pug'
import data from 'gulp-data'
import modules from 'postcss-modules'
import path from 'path'
import fs from 'fs'

function getJSONFromCssModules(cssFileName, json) {
  const cssName = path.basename(cssFileName, '.css')
  const jsonFileName = path.resolve('./build', `${cssName}.json`)
  fs.writeFileSync(jsonFileName, JSON.stringify(json))
}

function getClass(module) {
  const moduleFileName = path.resolve('./build', `${module}.json`)
  const classNames = fs.readFileSync(moduleFileName).toString()
  return JSON.parse(classNames)
}

gulp.task('css', () => {
  return gulp.src('./pages/index.css')
    .pipe(postcss([
      modules({
        getJSON: getJSONFromCssModules,
      })
    ]))
    .pipe(gulp.dest('./build'))
})

gulp.task('html', ['css'], () => {
  return gulp.src('./pages/index.pug')
    .pipe(data(file => {
      return {css: getClass(path.basename(file.path, '.pug'))}
    }))
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('./build'))
})

gulp.task('default', ['html'])