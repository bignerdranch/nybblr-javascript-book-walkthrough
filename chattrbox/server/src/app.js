var port = process.env.PORT || 3000;

var http = require('http');
var fs = require('fs');
var wss = require('./websockets-server');
var api = require('./api');
var auth = require('./auth');
var signal = require('./signal');
var VerifyClient = require('./verify-client');

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
var sessionParser = convert(session({ key: 'chattrbox.sid' }));
var extractSession = require('./extract-session')
  .bind(undefined, sessionParser, app);

app.use(sessionParser);

app.use(passport.initialize());
app.use(passport.session());
app.use(authApi.routes());

app.use(ensure);
app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());

var verifyClient = VerifyClient(extractSession);
wss(server, verifyClient, extractSession);
signal(server, verifyClient, extractSession);

server.listen(port);
