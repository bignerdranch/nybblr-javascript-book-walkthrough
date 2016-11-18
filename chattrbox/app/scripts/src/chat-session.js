import EventEmitter from 'wolfy87-eventemitter';

export default class ChatSession extends EventEmitter {
  constructor(userId, streams) {
    super();

    this.userId = userId;
    Object.assign(this, streams);

    this.channel.onmessage = ({ data }) => {
      this.emit('message', JSON.parse(data));
    };
  }
  send(msg) {
    this.channel.send(JSON.stringify(msg));
  }
}
