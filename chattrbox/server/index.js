const env = process.env.NODE_ENV || 'development';
const src = env === 'production' ? './dist' : './src';

require('babel-polyfill');
if (env === 'development') {
  require('babel-register');
  require('dotenv').config();
}

require(src);
