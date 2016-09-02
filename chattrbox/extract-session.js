var http = require('http');

module.exports = async (sessionParser, app, req) => {
  var res = new http.ServerResponse(req);
  var ctx = app.createContext(req, res);
  await sessionParser(ctx, async () => {});
  return ctx.session;
};
