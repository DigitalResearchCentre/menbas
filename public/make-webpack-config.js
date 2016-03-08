var webpack = require('webpack')
  , ResolverPlugin = webpack.ResolverPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  , IgnorePlugin = webpack.IgnorePlugin
  , path = require('path')
  , clientRoot = path.resolve(__dirname)
  , bowerRoot = path.resolve(clientRoot, '..', 'bower_components')
  , nodeRoot = path.resolve(clientRoot, '..', 'node_modules')
;

module.exports = function(options) {
  var env = options.env
    , devtool
  ;
  console.log(env);

  if (env == 'dev') {
    devtool = '#inline-source-map';
    debug = true;
  } else{
    devtool = '#source-map';
    debug = false;
  }

  var plugins = [
    new ResolverPlugin(new ResolverPlugin.DirectoryDescriptionFilePlugin(
      'bower.json', ['main']
    )), 
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),
    // prevent webpack accident include server security information
    new IgnorePlugin(new RegExp('config\/prod.*')),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', filename: 'vendor.bundle.js',
      minChunks: function(module, count) {
        return module.resource && module.resource.indexOf(clientRoot) === -1;
      }
    }),
  ];

  if (env === 'prod') {
    plugins.push(new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }));
  }

  return {
    devtool: devtool,
    debug: debug,

    context: clientRoot,
    entry: {
      app: path.join(clientRoot, 'app/index.js'),
    },
    output: {
      path: path.join(clientRoot, 'dist'),
      filename: '[name].bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
        },
        {
          test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=image/jpg&prefix=dist/"
        }, {
          test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=image/jpg&prefix=dist/"
        }, {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/font-woff&prefix=dist/"
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/font-woff&prefix=dist/"
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/octet-stream&prefix=dist/"
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=application/vnd.ms-fontobject&prefix=dist/"
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url?minetype=image/svg+xml&prefix=dist/"
        },
        {test: /\.css$/, loader: 'style!css'},
        {test: /\.less$/, loader: 'style!css!less?sourceMap'},
      ],
      noParse: [
      ]
    },
    resolve: {
      root: [clientRoot],
      modulesDirectories: ['web_modules', 'bower_components', 'node_modules', ],
      alias: {
        bower: bowerRoot,
        node: nodeRoot,
      },
    },
    plugins: plugins,
  };
};




