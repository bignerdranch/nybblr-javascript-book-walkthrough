import { start, receive } from './peer-connection';
import ChatSession from './chat-session';

export default class PrivateChat {
  constructor(signal) {
    this.signal = signal;
    this.chats = {};
  }
  async track(userId, factory) {
    var chat = this.chats[userId];
    if (!chat) {
      chat = { promise: factory() };
      this.chats[userId] = chat;
    }

    if (!chat.session) {
      var channel = await chat.promise;
      chat.session = new ChatSession(userId, channel);
    }

    return chat.session;
  }
  start(userId) {
    return this.track(userId,
      () => start(this.signal, userId));
  }
  listen() {
    var signal = this.signal;
    return signal.receive((from, msg) => {
      this.track(from,
        () => receive(signal, { from, msg }));
    });
  }
}
