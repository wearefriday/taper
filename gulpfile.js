var
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  serve = require('gulp-serve'),

  sources = {
    css: {
      manifest: 'scss/application.scss',
      watch: ['scss/**/*.scss'],
      dest_dir: 'css'
    }
  };

gulp.task('styles', function() {
  gulp.src(sources.css.manifest)
    .pipe(sass({ style: 'expanded', bundleExec: true }))
    .on('error', function(e) { console.log(e) })
    .pipe(gulp.dest(sources.css.dest_dir));
});

gulp.task('watch', function() {
  gulp.watch(sources.css.watch, ['styles']);
});

gulp.task('serve', serve('.'));

gulp.task('default', ['styles', 'watch', 'serve']);
