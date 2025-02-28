import gulp from 'gulp';
import RevAll from 'gulp-rev-all';

// Version all files (CSS, JS, assets, and HTML)
gulp.task('version-all', () => {
  return gulp
    .src(['index.html', 'pages/*.html', 'styles.css', 'script.js', 'assets/**/*'], { base: './', encoding: false }) // Set encoding: false
    .pipe(
      RevAll.revision({
        dontRenameFile: [/^favicon\.ico$/], // Prevent renaming specific files
        dontUpdateReference: [/^favicon\.ico$/], // Prevent updates for specific references
      })
    )
    .pipe(gulp.dest('dist')); // Output versioned files with the same structure
});

// Default task
gulp.task('default', gulp.series('version-all'));
