var gulp = require('gulp');

var del = require('del'),
  inject = require('gulp-inject'),
  cssnano = require('gulp-cssnano'),
  concatcss = require('gulp-concat-css'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant');


// Clear dist
gulp.task('clear', function () {
  return del.sync('dist');
});

// CSS
gulp.task('css', ['css-concat'], function () {
  return gulp.src('.temp/css/nano.min.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});
gulp.task('css-concat', function () {
  return gulp.src(['src/css/normalize.css', 'src/css/main.css'])
    .pipe(concatcss('nano.min.css'))
    .pipe(gulp.dest('.temp/css'));
});

// HTML
gulp.task('html', ['css'], function () {
  var sources = gulp.src(['dist/css/*.css'], { read: false });
  return gulp.src('src/index.html')
    .pipe(inject(sources, { ignorePath: 'dist/', addRootSlash: false }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// Images
gulp.task('img', function () {
  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'));
});

// Copy other files
gulp.task('copy', function () {
  return gulp.src(['src/robots.txt', 'src/sitemap.xml'])
    .pipe(gulp.dest('dist'));
});


// Default task
gulp.task('default', ['clear', 'img', 'html', 'copy'], function () {
  return del.sync('.temp');
});
