"use strict";

var webpack = require('webpack')
  , ResolverPlugin = webpack.ResolverPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  , path = require('path')
  , appRoot = path.resolve('app')
  , bowerRoot = path.resolve('bower_components')
;

module.exports = function(options) {
  return {
    context: appRoot,
    entry: {
      app: [path.join(appRoot, 'app.js')],
    },
    output: {
      path: appRoot,
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {test: /\.css$/, loader: "style!css"},
        {test: /\.less$/, loader: "style!raw!less?sourceMap"},
      ],
      noParse: [
        /\.eot|woff|ttf|svg$/,
      ]
    },
    resolve: {
      root: [appRoot],
      modulesDirectories: ['web_modules', 'bower_components', 'node_modules', ],
      alias: {
        bower: bowerRoot,
      },
    },
    plugins: [
      new ResolverPlugin(new ResolverPlugin.DirectoryDescriptionFilePlugin(
        'bower.json', ['main']
      )), 
      new ProvidePlugin({
        config: options.config || 'config.base',
      }),
    ],
    devtool: 'eval',
  };
};

