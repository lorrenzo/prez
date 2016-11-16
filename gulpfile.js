'use strict';

var _ = require('lodash');
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cached = require('gulp-cached'),
    changed = require('gulp-changed'),
    clean = require('gulp-clean'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    filter = require('gulp-filter'),
    gulpif = require('gulp-if'),
    gulpsequence = require('gulp-sequence'),
    gutil = require('gulp-util'),
	hologram = require('gulp-hologram'),
    imagemin = require('gulp-imagemin'),
    imageminSvgo = require('imagemin-svgo'),
    pngquant = require('imagemin-pngquant'),
    svgSprite = require('gulp-svg-sprite'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    csscomb = require('gulp-csscomb'),
    cssbeautify = require('gulp-cssbeautify'),
    sassinheritance = require('gulp-sass-inheritance'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    webpack = require('webpack-stream'),
    eslint = require('gulp-eslint');

// import de la conf webpack pour le bundle des js
var webpackConfig = require('./webpack.config');
var webpackDevConfig = require('./webpack.dev.config');

var SASS_FILES_DIR = './app/styles';
var SASS_FILES_PATH = SASS_FILES_DIR + '/**/*.scss';
var BUNDLED_CSS_FILES_PATH = './public';

var SVG_SPRITE_FILE = './public/svg/icons/view/sprite.scss';
var SVG_SPRITE_DIR = './app/styles/modules';

var CSS_FILES_TO_DEL = BUNDLED_CSS_FILES_PATH + '/**/*.css';
var CSS_FILES_NOT_TO_DEL = '!' + BUNDLED_CSS_FILES_PATH + '/**/*.min.css';

var WATCHED_JS_FILES_PATH = './app/**/*.js';
var JS_FILES_PATH = './app/client/**/*.js';
var BUNDLED_JS_FILES_PATH = './public';

var ASSETS_FILES_PATH = './app/assets/**/*';
var BUNDLED_ASSETS_FILES_PATH = './public';

var ASSETS_IMGS_PATH = './app/assets/img/**/*';
var ASSETS_SVGS_ICONS_PATH = './app/assets/svg/icons/**/*.svg';
var OPT_ASSETS_IMGS_PATH = './public/img';
var OPT_ASSETS_SVGS_ICONS_PATH = './public/svg/icons/';

var SASS_COMPILE_OPTIONS = {
	includePaths: ['./app/styles'],
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', 'Chrome >= 49']
};

var imageminConfig = {
    progressive: true,
    use: [pngquant()],
    svgoPlugins: [
        {
            removeViewBox: false,
        }, {
            cleanupIDs: false,
        }
    ]
};

var svgConfig = {
	shape               : {
		dimension       : {         // Set maximum dimensions
			maxWidth    : 32,
			maxHeight   : 32
		},
		spacing         : {         // Add padding
			padding     : 0
		}
	},
	mode                : {
		view            : {         // Activate the «view» mode
			bust        : false,
			render      : {
				scss    : true      // Activate Sass output (with default options)
			}
		},
		symbol          : true      // Activate the «symbol» mode
	}
};

/**
 * TASKS
 */

// copy static files
gulp.task('assets', function () {
    return gulp.src(ASSETS_FILES_PATH)
        .pipe(gulp.dest(BUNDLED_ASSETS_FILES_PATH))
});

// Optimize img files
gulp.task('img', function () {
    return gulp.src(ASSETS_IMGS_PATH)
        .pipe(imagemin(imageminConfig))
        .pipe(gulp.dest(OPT_ASSETS_IMGS_PATH));
});

// About svgs
gulp.task('build_svg', function () {
	return gulp.src(ASSETS_SVGS_ICONS_PATH)
		.pipe(svgSprite(svgConfig))
		.pipe(gulp.dest(OPT_ASSETS_SVGS_ICONS_PATH));
});
gulp.task('copy_svg_sprite', function () {
	return gulp.src(SVG_SPRITE_FILE)
		.pipe(rename({prefix: "_"}))
		.pipe(gulp.dest(SVG_SPRITE_DIR));
});

// compile css files
gulp.task('css', function () {
    return gulp.src(SASS_FILES_PATH)
        .pipe(changed(BUNDLED_CSS_FILES_PATH, {extension: '.css'}))
        .pipe(sourcemaps.init())
        .pipe(sass(SASS_COMPILE_OPTIONS).on('error', sass.logError))
        .pipe(csscomb())
        .pipe(cssbeautify({indent: '    '}))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(BUNDLED_CSS_FILES_PATH))

});

gulp.task('css _', function () {
    return gulp.src(SASS_FILES_PATH)
        .pipe(gulpif(global.isWatching, cached('sass')))
        .pipe(sassinheritance({dir: SASS_FILES_DIR}))
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe(sourcemaps.init())
        .pipe(sass(SASS_COMPILE_OPTIONS).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(BUNDLED_CSS_FILES_PATH));
});

// compile sass files
gulp.task('sass', function () {
    return gulp.src(SASS_FILES_PATH)
        .pipe(sourcemaps.init())
        .pipe(sass(SASS_COMPILE_OPTIONS).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(BUNDLED_CSS_FILES_PATH));
});

// bundle javascript files
function bundleJavascriptFile(webpackConfig) {
    return gulp.src(JS_FILES_PATH)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(BUNDLED_JS_FILES_PATH));
}

gulp.task('prod-js', function () {
    return bundleJavascriptFile(webpackConfig);
});

gulp.task('js', function () {
    return bundleJavascriptFile(webpackDevConfig);
});

// watch
gulp.task('setWatch', function () {
    global.isWatching = true;
});

gulp.task('eslint', () => {
    // on check les js dans app
    return gulp.src(['./app/**/*.js', '!./app/**/vendor/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

/// clean files during minification
gulp.task('clean:css', function (callback) {
    del([CSS_FILES_TO_DEL, CSS_FILES_NOT_TO_DEL], callback);
});

/// --- HOLOGRAM GUIDELINES TASK ---
gulp.task('guideline', function() {
	gulp.src('hologram_config.yml')
		.pipe(hologram())
});

/**
 * Production Tasks
 */

// compile and minify css files
gulp.task('mincss', function () {
    return gulp.src(SASS_FILES_PATH)
        .pipe(sass(SASS_COMPILE_OPTIONS).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(BUNDLED_CSS_FILES_PATH))
        .pipe(cssnano({
            safe: true,
            postcssZindex: false,
            zindex: false,
			autoprefixer: {browsers: ['last 2 versions', 'Chrome >= 49']}
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(BUNDLED_CSS_FILES_PATH));
});

/**
 * Main tasks
 */

// watch files
gulp.task('watch', ['setWatch'], function () {
    // css
    gulp.watch(SASS_FILES_PATH, ['css _', 'css'])
        .on('change', function (event) {
            gutil.log(gutil.colors.cyan('File ' + event.path + ' was ' + event.type + ', running tasks...'));
        });
    // js
    gulp.watch(WATCHED_JS_FILES_PATH, ['js'])
        .on('change', function (event) {
            gutil.log(gutil.colors.cyan('File ' + event.path + ' was ' + event.type + ', running tasks...'));
        });
});

// build assets
gulp.task('build', gulpsequence('eslint', 'assets', 'img', 'svg', 'js', 'css'));

// build svgs
gulp.task('svg', gulpsequence('build_svg', 'copy_svg_sprite'));

/**
 * Production task
 */

// minify css
gulp.task('prod-css', gulpsequence('mincss', 'clean:css'));

// build assets
gulp.task('prod-build', gulpsequence('eslint', 'assets', 'img', 'build_svg', 'copy_svg_sprite', 'prod-js', 'prod-css'));
