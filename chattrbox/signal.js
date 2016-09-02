var extractSession = require('./extract-session');
var WebSocketServer = require('ws').Server;

module.exports = (server, sessionParser, app) => {
  var verifyClient = async ({ req }, done) => {
    console.log('verifying client');
    try {
      var session = await extractSession(sessionParser, app, req);
      var hasSession = session && session.passport && session.passport.user;
      done(hasSession);
    } catch(e) {
      console.log(e);
      done(false);
    }
  };

  var wss = new WebSocketServer({ server, verifyClient, path: '/signal' });
  wss.on('connection', (socket) => {
    console.log('signal connection established');
    socket.on('message', (data) => {
      console.log('signal received: ' + data);
    });
  });
};
