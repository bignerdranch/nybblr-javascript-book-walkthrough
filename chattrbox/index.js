var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');

var Koa = require('koa');
var app = new Koa();

app.use(ctx => {
  ctx.body = 'Hello Koa';
});

var server = http.createServer(app.callback());

server.listen(3000);
