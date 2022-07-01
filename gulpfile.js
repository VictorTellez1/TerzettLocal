const { src, dest, watch , series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin'); // Minificar imagenes 
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
var gulp = require('gulp');
var path = require('path');
var open = require('gulp-open');

const paths = {
  js: 'src/js/**/*.js',
  imagenes: 'src/img/**/*',
  HERE: './',
  DIST: 'dist/', 
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/now-ui-dashboard.scss',
  SCSS: './assets/scss/**/**',
}

// css es una función que se puede llamar automaticamente
function compilescss() {
  return src(paths.SCSS_TOOLKIT_SOURCES)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error',sass.logError))
      .pipe(postcss([autoprefixer(), cssnano()]))
      // .pipe(postcss([autoprefixer()]))
      
      .pipe(sourcemaps.write(paths.HERE))
      .pipe(dest(paths.CSS));
      
}

function javascript() {
  return src(paths.js)
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/build/js'));
}

function imagenes() {
  return src(paths.imagenes)
      .pipe(cache(imagemin({ optimizationLevel: 3})))
      .pipe(dest('public/build/img'))
      .pipe(notify({ message: 'Imagen Completada'}));
}

function versionWebp() {
  return src(paths.imagenes)
      .pipe( webp() )
      .pipe(dest('public/build/img'))
      .pipe(notify({ message: 'Imagen Completada'}));
}


function watchArchivos() {
  watch( paths.js, javascript );
  watch( paths.imagenes, imagenes );
  watch( paths.imagenes, versionWebp );
  watch(paths.SCSS,compilescss);
}
function open(){
  return src('examples/dashboard.html')
  .pipe(open());
}

exports.compilescss = compilescss;
exports.watchArchivos = watchArchivos;
exports.default = parallel(compilescss, javascript,  imagenes, versionWebp,  watchArchivos,open ); 