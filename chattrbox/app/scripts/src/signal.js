import EventEmitter from 'wolfy87-eventemitter';

export default function signal(url) {
  var events = new EventEmitter();

  let socket = new WebSocket(url);
  console.log('connecting to signaling server...');

  socket.onopen = () => {
    console.log('signal open');
    socket.onmessage = (e) => {
      console.log('signal received: ' + e.data);
      let { from, msg } = JSON.parse(e.data);
      events.emit('message', from, msg);
      events.emit(`reply/${from}`, msg);
    };
  };

  var send = (to, msg) => {
    socket.send(JSON.stringify({ to, msg }));
  };

  var awaitReply = (userId) => {
    return new Promise((resolve) => {
      events.once(`reply/${userId}`, resolve);
    });
  };

  return Object.assign(events, {
    socket,
    send,
    awaitReply
  });
}
