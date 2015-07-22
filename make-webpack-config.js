"use strict";

var webpack = require('webpack')
  , ResolverPlugin = webpack.ResolverPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  , path = require('path')
  , appRoot = path.resolve('app')
  , bowerRoot = path.resolve('bower_components')
  , nodeRoot = path.resolve('node_modules')
  , reactPath = path.resolve(nodeRoot, 'react/dist/react.min.js')
;

module.exports = function(options) {
  var env = options.env
    , devtool = (env == 'dev') ? '#eval' : '#source-map'
  ;
  return {
    context: appRoot,
    entry: {
      app: [path.join(appRoot, 'app.js')],
    },
    output: {
      path: path.join(appRoot, '..'),
      filename: '[name].bundle.js',
    },
    module: {
      loaders: [
        {test: require.resolve('react'), loader: 'expose?React'},
        {text: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony'},
        {test: /\.css$/, loader: "style!css"},
        {test: /\.less$/, loader: "style!raw!less?sourceMap"},
      ],
      noParse: [
        /\.eot|woff|ttf|svg$/,
        reactPath,
      ]
    },
    resolve: {
      root: [appRoot],
      modulesDirectories: ['web_modules', 'bower_components', 'node_modules', ],
      alias: {
        bower: bowerRoot,
        react: reactPath,
      },
    },
    plugins: [
      new ResolverPlugin(new ResolverPlugin.DirectoryDescriptionFilePlugin(
        'bower.json', ['main']
      )), 
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env),
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', filename: 'vendor.bundle.js',
        minChunks: function(module, count) {
          return module.resource && module.resource.indexOf(appRoot) === -1;
        }
      }),
    ],
    devtool: devtool,
  };
};

