export default class ChatSession {
  constructor(userId, { channel, localStream, remoteStream }) {
    this.userId = userId;
    this.channel = channel;
    this.local = localStream;
    this.remote = remoteStream;
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
