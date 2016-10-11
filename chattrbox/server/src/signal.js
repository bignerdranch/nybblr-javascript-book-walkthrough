var WebSocketServer = require('ws').Server;

module.exports = (server, verifyClient, extractSession) => {
  var clients = {};
  var wss = new WebSocketServer({
    server,
    verifyClient,
    path: '/signal'
  });
  wss.on('connection', async (ws) => {
    console.log('signal connection established');
    var session = await extractSession(ws.upgradeReq);
    var userId = session.passport.user;
    clients[userId] = ws;

    ws.on('message', (data) => {
      console.log('signal received: ' + data);
      var { to, msg } = JSON.parse(data);
      var wsTo = clients[to];
      if (wsTo) {
        wsTo.send(JSON.stringify({ from: userId, msg }));
      }
    });

    ws.on('close', () => {
      console.log('signal connection disconnected');
      delete clients[userId];
    });
  });
};
