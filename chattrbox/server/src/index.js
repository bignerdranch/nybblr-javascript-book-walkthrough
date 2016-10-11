var http = require('http');
var wss = require('./websockets-server');
var api = require('./api');

var Koa = require('koa');
var compress = require('koa-compress');
var serve = require('koa-static');
var mount = require('koa-mount');
var app = new Koa();

app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());
wss(server);

server.listen(3000);
