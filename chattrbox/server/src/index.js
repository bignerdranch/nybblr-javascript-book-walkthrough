var http = require('http');
var wss = require('./websockets-server');

var Koa = require('koa');
var compress = require('koa-compress');
var serve = require('koa-static');
var app = new Koa();

app.use(compress());
app.use(serve('./app'));

var server = http.createServer(app.callback());

server.listen(3000);
