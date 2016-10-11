var http = require('http');
var wss = require('./websockets-server');
var api = require('./api');
var auth = require('./auth');

var Koa = require('koa');
var compress = require('koa-compress');
var serve = require('koa-static');
var mount = require('koa-mount');

var passport = require('koa-passport');
var convert = require('koa-convert');
var session = require('koa-generic-session');

var SESSION_SECRET = process.env.SESSION_SECRET;

var app = new Koa();

app.keys = [SESSION_SECRET];
app.use(convert(session({ key: 'chattrbox.sid' })));

var authApi = auth({ passport });

app.use(passport.initialize());
app.use(passport.session());
app.use(authApi.routes());
app.use(auth.redirect);

app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());
wss(server);

server.listen(3000);
