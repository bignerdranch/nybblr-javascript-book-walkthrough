var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

module.exports = (server) => {
  var ws = new WebSocketServer({ server, path: '/' });
  var messages = [];
  console.log('websockets server started');
  ws.on('connection', function(socket) {
    console.log('client connection established');
    messages.forEach(function(msg) {
      socket.send(msg);
    });
    socket.on('message', function(data) {
      console.log('message received: ' + data);
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    });
  });
};
