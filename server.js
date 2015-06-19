'use strict';

var WebpackDevServer = require('webpack-dev-server')
  , webpack = require('webpack')
  , path = require('path')
  , stdio = require('stdio')
;

var ops = stdio.getopt({
  config: false
});

var config = require('./make-webpack-config')({
  config: ops.config,
});

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  contentBase: path.resolve('.'),
  filename: config.output.filename,
  publicPath: '/app/',
  hot: true,
  stats: {
    colors: true,
    progress: true,
  }
});

server.listen(8888, 'localhost', function(){});

