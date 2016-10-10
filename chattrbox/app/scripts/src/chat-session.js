import EventEmitter from 'wolfy87-eventemitter';

export default class ChatSession extends EventEmitter {
  constructor(userId, { channel, localStream, remoteStream }) {
    super();

    this.userId = userId;
    this.channel = channel;
    this.local = localStream;
    this.remote = remoteStream;

    this.channel.onmessage = ({ data }) => {
      this.emit('message', JSON.parse(data));
    };
  }
  send(msg) {
    this.channel.send(JSON.stringify(msg));
  }
}
