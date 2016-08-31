var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');
var api = require('./api');
var auth = require('./auth');
var signal = require('./signal');

var serve = require('koa-static');
var compress = require('koa-compress');
var mount = require('koa-mount');
var Koa = require('koa');

var passport = require('koa-passport');
var convert = require('koa-convert');
var session = require('koa-generic-session');

var app = new Koa();

var SESSION_SECRET = process.env.SESSION_SECRET;

var { api: authApi, ensure } = auth({ passport });

app.keys = [SESSION_SECRET];
app.use(convert(session({ key: 'chattrbox.sid' })));

app.use(passport.initialize());
app.use(passport.session());
app.use(authApi.routes());

app.use(ensure);
app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());
wss(server);
signal(server);
server.listen(3000);
