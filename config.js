// Paths
//
var build = "_site";

module.exports = {
  // BrowserSync
  browsersync: {
    development: {
      server: {
        baseDir: [build],
      },
      notify: false,
    },
  },

  // Watch source files
  watch: {
    jekyll: [
      "_config.yml",
      "_config-dev.yml",
      "_data/*.yml",
      "_includes/**/*.html",
      "assets/img/*.{png,jpg,svg}",
      "assets/js/*.js",
      "assets/js/**/*.js",
      "*.html",
      "_layouts/*.html",
      "pages/**/*.{html,markdown,md,yml,json,txt,xml}",
    ]
  }
};