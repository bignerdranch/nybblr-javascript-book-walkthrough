var api = require('koa-router')();

api.get('/users', async ctx => {
  ctx.body = [
    { id: 1, email: 'clark.kent@bignerdranch.com', name: 'Clark Kent' },
    { id: 2, email: 'diana.prince@bignerdranch.com', name: 'Diana Prince' }
  ];
});

api.get('/users/me', async ctx => {
  var { id, email, name } = ctx.state.user;
  ctx.body = { id, email, name };
});

module.exports = api;
