import { start, receive } from './peer-connection';
import ChatSession from './chat-session';

const noop = () => {};

export default class PrivateChat {
  constructor(signal, handler = noop) {
    this.signal = signal;
    this.chats = {};
    this.handler = handler;
  }
  async track(userId, factory) {
    var chat = this.chats[userId];
    if (!chat) {
      chat = { promise: factory() };
      this.chats[userId] = chat;
    }

    var channel = await chat.promise;

    if (!chat.session) {
      chat.session = new ChatSession(userId, channel);
      this.handler(chat.session);
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
