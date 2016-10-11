var api = require('koa-router')();

api.get('/users', async ctx => {
  ctx.body = [
    { id: 1, email: 'clark.kent@bignerdranch.com', name: 'Clark Kent' },
    { id: 2, email: 'diana.prince@bignerdranch.com', name: 'Diana Prince' }
  ];
});

module.exports = api;
