var http = require('http');
var wss = require('./websockets-server');
var signal = require('./signal');
var api = require('./api');
var auth = require('./auth');
var VerifyClient = require('./verify-client');

var Koa = require('koa');
var compress = require('koa-compress');
var serve = require('koa-static');
var mount = require('koa-mount');

var passport = require('koa-passport');
var convert = require('koa-convert');
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo')

var SESSION_SECRET = process.env.SESSION_SECRET;
var MONGODB_URI = process.env.MONGODB_URI;

var app = new Koa();

app.keys = [SESSION_SECRET];
var sessionParser = convert(session({
  key: 'chattrbox.sid',
  store: new MongoStore({ url: MONGODB_URI })
}));
app.use(sessionParser);

var extractSession = require('./extract-session')
  .bind(undefined, sessionParser, app);

var authApi = auth({ passport });

app.use(passport.initialize());
app.use(passport.session());
app.use(authApi.routes());
app.use(auth.redirect);

app.use(compress());
app.use(serve('./app'));
app.use(mount('/api', api.routes()));

var server = http.createServer(app.callback());

var verifyClient = VerifyClient(extractSession);
wss(server, verifyClient);
signal(server, verifyClient, extractSession);

server.listen(3000);
