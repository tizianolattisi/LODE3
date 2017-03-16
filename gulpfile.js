var gulp = require('gulp');
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');

// default task -> do nothing
gulp.task('default', []);

/* -----
 * Build Tasks
 ----- */

// Build Task
// - Server
//   1. Install NPM dependencies
//   2. Copy deps and resources into ./bin folder
//   3. Compile server into ./bin folder
// - Client
//   1. Install NPM dependencies
//   3. Build Angular2 App for production (Ahead Of Time compilation)
gulp.task('build', function (cb) {
    runSequence(
        'npm-install-server',
        'copy-nm-server',
        'copy-resource-files',
        'typescript-server',
        'npm-install-client',
        'build-angular',
        cb);
});

// Install NPM Dependencies
gulp.task('npm-install-server', shell.task(['cd server && npm install']));
gulp.task('npm-install-client', shell.task(['cd client && npm install']));

// Compile Angular2 App using the 'Ahead Of Time compilation'
gulp.task('build-angular', shell.task(['cd client && ./node_modules/@angular/cli/bin/ng build --target=production --environment=prod']));

//Clean files produced by build tasks
gulp.task('clean', shell.task([
    'rm -rf bin',
    'rm -rf server/node_modules',
    'rm -rf client/node_modules',
    'find client/src -type f -name "*.js" -delete',
    'find client/src -type f -name "*.map" -delete',
    'rm -rf client/dist'
]));


/* -----
 * Typescript compilation
 ----- */

// compile server into ./bin
gulp.task('typescript-server', function () {

    var tsProject = typescript.createProject('./server/tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('./bin'));
});

// compile client
gulp.task('typescript-client', function () {

    var tsProject = typescript.createProject('./client/src/tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('./bin/client'));
});

// watch for file changes and compile
gulp.task('typescript:watch', function () {
    gulp.watch('./**/*.ts', ['typescript-server', 'typescript-client']);
});

/* -----
 * Files copy
 ----- */

// Copy server NPM dependencies into ./bin
gulp.task('copy-nm-server', function () {
    gulp.src('./server/node_modules/**/*.*')
        .pipe(gulp.dest('./bin/node_modules'));
});

// Copy server resources files into ./bin
gulp.task('copy-resource-files', function () {
    gulp.src('./server/resources/**/*')
        .pipe(gulp.dest('./bin/resources'));
});
