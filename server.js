'use strict';

var WebpackDevServer = require('webpack-dev-server')
  , webpack = require('webpack')
  , path = require('path')
  , stdio = require('stdio')
  , ops, config, compiler, server
;

ops = stdio.getopt({
  env: {args: 1, description: 'ex. dev, prod, test'}
});

config = require('./make-webpack-config')({
  env: (ops.env || 'dev'),
});

compiler = webpack(config);

server = new WebpackDevServer(compiler, {
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

