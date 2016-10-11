var http = require('http');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var extract = require('./extract');
var wss = require('./websockets-server');

var Koa = require('koa');
var send = require('koa-send');
var compress = require('koa-compress');
var app = new Koa();

app.use(compress());
app.use(async ctx => {
  console.log('Responding to a request.');
  var filePath = extract(ctx.request.url);
  await send(ctx, filePath, {
    root: path.resolve(__dirname, '../../app')
  });
});

var server = http.createServer(app.callback());

server.listen(3000);
