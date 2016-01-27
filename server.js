'use strict';

var server = require('http-server')
  , webpack = require('webpack')
  , path = require('path')
  , stdio = require('stdio')
  , ops, config, compiler, server, env
;

ops = stdio.getopt({
  env: {args: 1, description: 'ex. dev, prod, test'},
});

env = (ops.env || 'dev');

config = require('./make-webpack-config')({
  env: env,
});

compiler = webpack(config);

if (env == 'dev') {
  compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
  }, handleError);

  server.createServer({
    root: path.join(__dirname),
  }).listen(8888);

} else {
  compiler.run(handleError);
}

function handleError(err, stats) {
  if (err) {
    return console.log(err);
  }
  console.log(stats.toString({
    colors: true,
  }));
}
