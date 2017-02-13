/* Exports a function which returns an object that overrides the default &
 *   plugin grunt configuration object.
 *
 * You can familiarize yourself with Lineman's defaults by looking at:
 *
 *   - https://github.com/linemanjs/lineman/blob/master/config/application.coffee
 *   - https://github.com/linemanjs/lineman/blob/master/config/plugins
 *
 * You can also ask about Lineman's  config from the command line:
 *
 *   $ lineman config #=> to print the entire config
 *   $ lineman config concat_sourcemap.js #=> to see the JS config for the concat task.
 */
module.exports = function(lineman) {
  //Override application configuration here. Common examples follow in the comments.
  return {

    // API Proxying
    //
    // During development, you'll likely want to make XHR (AJAX) requests to an API on the same
    // port as your lineman development server. By enabling the API proxy and setting the port, all
    // requests for paths that don't match a static asset in ./generated will be forwarded to
    // whatever service might be running on the specified port.
    //
    // server: {
    //   apiProxy: {
    //     enabled: true,
    //     host: 'localhost',
    //     port: 3000
    //   }
    // },

    // Sass
    //
    // Lineman supports Sass via grunt-contrib-sass, which requires you first
    // have Ruby installed as well as the `sass` gem. To enable it, uncomment the
    // following line:
    //
    // enableSass: true,

    // Asset Fingerprints
    //
    // Lineman can fingerprint your static assets by appending a hash to the filename
    // and logging a manifest of logical-to-hashed filenames in dist/assets.json
    // via grunt-asset-fingerprint
    //
    // enableAssetFingerprint: true,

    // LiveReload
    //
    // Lineman can LiveReload browsers whenever a file is changed that results in
    // assets to be processed, preventing the need to hit F5/Cmd-R every time you
    // make a change in each browser you're working against. To enable LiveReload,
    // comment out the following line:
    //
      livereload: true,

      loadNpmTasks: lineman.config.application.loadNpmTasks.concat("grunt-bowercopy","grunt-asciify","grunt-open"),

      prependTasks: {
          common: lineman.config.application.prependTasks.common.concat("bowercopy","banner:Preparing DEMO:doom","open:dev")
      },

      removeTasks: {
            common: lineman.config.application.removeTasks.common.concat("coffee")
      },

      asciify: {
        foo: {
            text: "Getting started",
            options: {log:true, font: "doom"}
        }
      },

      open: {
        dev : {
            path: 'http://localhost:8000/',
            //app: 'Google Chrome'
        }
      },

      bowercopy: {
        options: {
            srcPrefix: "bower_components/",
            destPrefix: "vendor/bower_components/"
        } ,
        angular: {
            // list of destination: source
            // the source dest will always start with bower_components/ because of the options.
            // same with destination... will be put under vendor
            files: {
                "js/angular.js": "angular/angular.js",
                "js/angular-ui-router.js": "angular-ui-router/release/angular-ui-router.js"
            }
        },
        ngMock: {
            options: {
                destPrefix: "spec/helpers/bower_components",
            },
            files: {
                "angular-mocks.js": "angular-mocks/angular-mocks.js"
            }
        }

      }

  };
};
