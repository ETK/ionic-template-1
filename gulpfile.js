var gulp = require('gulp');
var bower = require('bower');
var sass = require('gulp-sass');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var jshint = require('gulp-jshint');
var packageJSON  = require('./package');
var jscs = require('gulp-jscs');

var paths = {
    app_js: ['./www/app/**/*.js'],
    sass: ['./www/app/**/*.scss'],
    templatecache: ['./www/app/**/*.html'],
    useref: ['./www/*.html']
};

gulp.task('default', ['lint','jscs','sass','templatecache','ng_annotate','useref']);

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.templatecache, ['templatecache']);
    gulp.watch(paths.app_js, ['ng_annotate']);
    gulp.watch(paths.app_js, ['lint']);
    gulp.watch(paths.app_js, ['jscs']);
    gulp.watch(paths.useref, ['useref']);
});

/* Check JS for unused variables, errors etc */
gulp.task('lint', function() {
    var jshintConfig = packageJSON.jshintConfig;
    return gulp.src(paths.app_js)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'));
});

/* Check code complies with set code style */
gulp.task('jscs', function() {
    return gulp.src(paths.app_js)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

/* Process SCSS files and output them as CSS file in ./www/app */
gulp.task('sass', function(done) {
    gulp.src('./www/app/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/app'))
    .on('end', done);
});

/* Process HTML templates and output them as JS file in ./www/app */
gulp.task('templatecache', function (done) {
    gulp.src(paths.templatecache)
    .pipe(templateCache({
        standalone:true,
        templateHeader: '(function (angular) {\'use strict\';angular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {/* jshint quotmark:false */',
        templateBody: '$templateCache.put(\'<%= url %>\',\'<%= contents %>\');',
        templateFooter: '/* jshint quotmark:single */}]);})(window.angular);'
    }))
    .pipe(gulp.dest('./www/app'))
    .on('end', done);
});

/* Process all app JS files by forcing strict dependency injection ready for minification and output them in ./www/dist/dist_js/app */
gulp.task('ng_annotate', function (done) {
    gulp.src(paths.app_js)
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('./www/dist/dist_js/app'))
    .on('end', done);
});

/* Process index.html by concatenating build:css & build:js into ./www/dist/dist_XX/*.* */
gulp.task('useref', function (done) {
    var assets = useref.assets();
    gulp.src('./www/index.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('./www/dist'))
    .on('end', done);
});