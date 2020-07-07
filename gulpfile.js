/*jshint node:true, esversion: 6 */
/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/
"use strict";

const autoprefixer  = require("autoprefixer");
const browsersync   = require("browser-sync");
const cp            = require("child_process");
const csso          = require("postcss-csso");
const del           = require("del");
const gulp          = require("gulp");
const log           = require("fancy-log");
const notify        = require("gulp-notify");
const pkg           = require("./node_modules/uswds/package.json");
const postcss       = require("gulp-postcss");
const replace       = require("gulp-replace");
const sass          = require("gulp-sass");
const sourcemaps    = require("gulp-sourcemaps");
const uswds         = require("./node_modules/uswds-gulp/config/uswds");

const config        = require("./config");
const bSConfig      = config.browsersync.development;
const env           = process.env.NODE_ENV || "prod";
const watchConfig   = config.watch;

/*
----------------------------------------
PATHS
----------------------------------------
- All paths are relative to the project root
- Don't use a trailing `/` for path names
----------------------------------------
*/

// Project Sass source directory
// As a user of this repo, this is where you make style changes
const PROJECT_SASS_SRC = './assets/uswds-theme';

// This is where the html-prototype application stylesheets live
// As a user of this repo, you can change these but should not have to
const PROTOTYPE_SASS_SRC = './assets/stylesheets';

// USWDS Sass source directory
const PROJECT_USWDS_SASS_SRC = './assets/uswds-sass';

// Images destination
const IMG_DEST = './assets/img';

// Fonts destination
const FONTS_DEST = './assets/fonts';

// Javascript destination
const JS_DEST = './assets/js/vendor';

// Compiled CSS destinations
// 1. Compile uswds-theme/styles.scss
// 2. That is imported by stylesheets/application.scss which generates application.css
// 3. application.css is what is consumed by the pages of the application being built
// 4. In order for browserSync to work, we must drop the application.css in the _site directory
const PROJECT_SASS_DEST = './assets/stylesheets';
const PROJECT_SASS_SITE_DEST = './_site/assets/stylesheets';

/*
----------------------------------------
FUNCTIONS
----------------------------------------
*/

function browserSync(done) {
  browsersync.init(bSConfig);
  done();
}

// Reload task, that is used by jekyll-rebuild
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del([
    "./_site/assets/", 
    `${PROJECT_SASS_DEST}/*.css`, 
    `${PROJECT_SASS_DEST}/*.css.map`
  ]);
}

function css() {
  var plugins = [
    autoprefixer({
      cascade: false,
      grid: true
    }),
    // Minify
    csso(({ forcedMediaMerge: false }))
  ];

  return (
    gulp
      .src([`${PROJECT_SASS_SRC}/styles.scss`, `${PROTOTYPE_SASS_SRC}/application.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({
          includePaths: [
            `${PROJECT_SASS_SRC}`,
            `${uswds}/scss`,
            `${uswds}/scss/packages`,
          ]
        })
      )
      .pipe(replace(/\buswds @version\b/g, 'based on uswds v' + pkg.version))
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${PROJECT_SASS_DEST}`))
      .pipe(gulp.dest(`${PROJECT_SASS_SITE_DEST}`))
      .pipe(notify({
        "sound": "Pop" // case sensitive
      }))
  );
}

function jekyll(done) {
  log("Running buildJekyll");

  if (env === "prod") {
    log("Building for production");
    return cp
      .spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" })
      .on("close", done);
  } else {
    log("Building for development");
    return cp
      .spawn(
        "bundle",
        ["exec", "jekyll", "build", "--config", "_config.yml,_config-dev.yml"],
        { stdio: "inherit" }
      )
      .on("close", done);
  }
}

function watchFiles() {
  gulp.watch(watchConfig.jekyll, gulp.series(jekyll, browserSyncReload));
  gulp.watch(
    [
      `${PROTOTYPE_SASS_SRC}/application.scss`,
      `${PROTOTYPE_SASS_SRC}/base/_base.scss`,
      `${PROTOTYPE_SASS_SRC}/base/_forms.scss`,
      `${PROTOTYPE_SASS_SRC}/_variables.scss`,
      `${PROJECT_SASS_SRC}/*.scss`,
    ], 
    gulp.series(css, browserSyncReload)
  );
}

/*
----------------------------------------
TASKS
----------------------------------------
*/

const copyUSWDSSetup = () => {
  return gulp.src(`${uswds}/scss/theme/**/**`)
  .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
}

const copyUSWDSCore = () => {
  return gulp.src(`${uswds}/scss/core/**/**`)
  .pipe(gulp.dest(`${PROJECT_USWDS_SASS_SRC}/core`));
}

const copyUSWDSLib = () => {
  return gulp.src(`${uswds}/scss/lib/**/**`)
  .pipe(gulp.dest(`${PROJECT_USWDS_SASS_SRC}/lib`));
}

const copyUSWDSSettings = () => {
  return gulp.src(`${uswds}/scss/settings/**/**`)
  .pipe(gulp.dest(`${PROJECT_USWDS_SASS_SRC}/settings`));
}

const copyUSWDSFonts = () => {
  return gulp.src(`${uswds}/fonts/**/**`)
  .pipe(gulp.dest(`${FONTS_DEST}`));
}

const copyUSWDSImages = () => {
  return gulp.src(`${uswds}/img/**/**`)
  .pipe(gulp.dest(`${IMG_DEST}`));
}

const copyUSWDSJS = () => {
  return gulp.src(`${uswds}/js/**/**`)
  .pipe(gulp.dest(`${JS_DEST}`));
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(css, jekyll));

const init = gulp.series(
  copyUSWDSSetup,
  copyUSWDSCore,
  copyUSWDSLib,
  copyUSWDSSettings,
  copyUSWDSFonts,
  copyUSWDSImages,
  copyUSWDSJS,
  css
);

const update = gulp.series(
  copyUSWDSCore,
  copyUSWDSLib,
  copyUSWDSSettings,
  copyUSWDSFonts,
  copyUSWDSImages,
  copyUSWDSJS,
  css
);

const watch = gulp.parallel(watchFiles, browserSync);

// Export tasks
exports.css = css;
exports.init = init;
exports.jekyll = jekyll;
exports.build = build;
exports.watch = watch;
exports.default = build;