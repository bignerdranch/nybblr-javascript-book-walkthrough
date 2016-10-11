var api = require('koa-router')();
var { User } = require('./db');

api.get('/users', async ctx => {
  var users = await User.find();
  ctx.body = users.map(
    ({ id, email, name }) => ({ id, email, name })
  );
});

api.get('/users/me', async ctx => {
  var { id, email, name } = ctx.state.user;
  ctx.body = { id, email, name };
});

module.exports = api;
