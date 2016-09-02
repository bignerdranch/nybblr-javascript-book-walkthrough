require('webrtc-adapter');

export default function signal(url) {
  let socket = new WebSocket(url);
  console.log('connecting to signaling server...');

  let onmessage = () => {};

  let replyHandlers = {};
  let onreply = (from, msg) => {
    let handler = replyHandlers[from];
    delete replyHandlers[from];
    handler && handler(msg);
  };

  socket.onopen = () => {
    console.log('signal open');
    socket.onmessage = (e) => {
      console.log('signal received: ' + e.data);
      let { from, msg } = JSON.parse(e.data);
      onmessage(from, msg);
      onreply(from, msg);
    };
  };

  var receive = (cb) => {
    onmessage = cb;
  };

  var send = (to, msg) => {
    socket.send(JSON.stringify({ to, msg }));
  };

  var awaitReply = (userId) => {
    return new Promise((resolve) => {
      replyHandlers[userId] = resolve;
    });
  };

  return {
    socket,
    send,
    receive,
    awaitReply
  };
}
