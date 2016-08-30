var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');
var api = require('./api');

var serve = require('koa-static');
var compress = require('koa-compress');
var mount = require('koa-mount');
var Koa = require('koa');
var app = new Koa();

app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());
wss(server);
server.listen(3000);
