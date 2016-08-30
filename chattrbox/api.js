var KoaRouter = require('koa-router');

var api = KoaRouter();

api.get('/users', async (ctx, next) => {
  ctx.body = [
    { email: 'clark.kent@bignerdranch.com', name: 'Clark Kent' },
    { email: 'diana.prince@bignerdranch.com', name: 'Diana Prince' }
  ];
});

module.exports = api;
