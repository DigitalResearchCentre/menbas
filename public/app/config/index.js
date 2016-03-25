'use strict';

let config;
switch (process.env.NODE_ENV) {
  case 'production':
    config = require('./prod');
    break;
  case 'development':
    config = require('./dev');
    break;
  default:
    config = require('./dev');
}

export default config;


