export default function signal(url) {
  let socket = new WebSocket(url);
  console.log('connecting to signaling server...');

  let onmessage;

  socket.onopen = () => {
    console.log('signal open');
    socket.onmessage = (e) => {
      console.log('signal received: ' + e.data);
      let { from, msg } = JSON.parse(e.data);
      onmessage(from, msg);
    };
  };

  var receive = (cb) => {
    onmessage = cb;
  };

  var send = (to, msg) => {
    socket.send(JSON.stringify({ to, msg }));
  };

  return {
    socket,
    send,
    receive
  };
}
