var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var { Message } = require('./db');

module.exports = (server, verifyClient) => {
  var ws = new WebSocketServer({ server, verifyClient });
  console.log('websockets server started');
  ws.on('connection', async function(socket) {
    console.log('client connection established');
    var messages = await Message.find();
    messages.forEach(function(msg) {
      socket.send(JSON.stringify(msg));
    });
    socket.on('message', function(data) {
      console.log('message received: ' + data);
      Message.create(JSON.parse(data));
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    });
  });
};
