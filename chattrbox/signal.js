var WebSocketServer = require('ws').Server;

module.exports = (server) => {
  var wss = new WebSocketServer({ server, path: '/signal' });
  wss.on('connection', (socket) => {
    console.log('signal connection established');
    socket.on('message', (data) => {
      console.log('signal received: ' + data);
    });
  });
};
