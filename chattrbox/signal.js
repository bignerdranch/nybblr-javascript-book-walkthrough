var WebSocketServer = require('ws').Server;

module.exports = (server, verifyClient) => {
  var wss = new WebSocketServer({ server, verifyClient, path: '/signal' });
  wss.on('connection', (socket) => {
    console.log('signal connection established');
    socket.on('message', (data) => {
      console.log('signal received: ' + data);
    });
  });
};
