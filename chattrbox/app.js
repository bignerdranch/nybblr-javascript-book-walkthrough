var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');

var send = require('koa-send');
var Koa = require('koa');
var app = new Koa();

app.use(async (ctx, next) => {
  console.log('Responding to a request.');
  var filePath = extract(ctx.request.url);
  await send(ctx, filePath, { root: __dirname + '/app' });
});

var server = http.createServer(app.callback());
server.listen(3000);
