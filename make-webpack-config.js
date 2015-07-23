"use strict";

var webpack = require('webpack')
  , ResolverPlugin = webpack.ResolverPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  , path = require('path')
  , appRoot = path.resolve('app')
  , bowerRoot = path.resolve('bower_components')
  , nodeRoot = path.resolve('node_modules')
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
      path: path.join(appRoot, '..', 'build'),
      filename: '[name].bundle.js',
    },
    module: {
      loaders: [
        {test: require.resolve('react'), loader: 'expose?React'},
        {
          text: /\.jsx?$/, 
          exclude: /min.js$/,
          loader: 'babel-loader'
        },
        {test: /\.css$/, loader: "style!css"},
        {test: /\.less$/, loader: "style!css!less?sourceMap"},
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=application/font-woff"
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=application/font-woff"
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=application/octet-stream"
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file"
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?limit=10000&minetype=image/svg+xml"
        },
      ],
      noParse: [
        path.join(nodeRoot, 'react/dist/react-with-addons.min.js'),
        path.join(nodeRoot, 'd3/d3.min.js'),
        path.join(nodeRoot, 'jquery/dist/jquery.min.js'),
      ]
    },
    resolve: {
      root: [appRoot],
      modulesDirectories: ['web_modules', 'bower_components', 'node_modules', ],
      alias: {
        bower: bowerRoot,
        react: path.join(nodeRoot, 'react/dist/react-with-addons.min.js'),
        d3: path.join(nodeRoot, 'd3/d3.min.js'),
        jquery: path.join(nodeRoot, 'jquery/dist/jquery.min.js'),
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

