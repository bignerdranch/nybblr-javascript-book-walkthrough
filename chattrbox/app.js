var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');

var serve = require('koa-static');
var compress = require('koa-compress');
var Koa = require('koa');
var app = new Koa();

app.use(compress());
app.use(serve('./app'));

var server = http.createServer(app.callback());
server.listen(3000);
