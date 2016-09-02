export default class ChatSession {
  constructor(userId, channel) {
    this.userId = userId;
    this.channel = channel;
  }
  send(msg) {
    this.channel.send(JSON.stringify(msg));
  }
  receive(cb) {
    this.channel.onmessage = ({ data }) => {
      cb(JSON.parse(data));
    };
  }
}
