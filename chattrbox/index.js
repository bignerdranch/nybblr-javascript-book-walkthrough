var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');

var Koa = require('koa');
var app = new Koa();

app.use(ctx => {
  console.log('Responding to a request.');
  var filePath = extract(ctx.request.url);
  var stream = fs.createReadStream(filePath);
  ctx.body = stream;
  ctx.response.remove('Content-Type');
});

var server = http.createServer(app.callback());

server.listen(3000);
