import { start } from './peer-connection';
import ChatSession from './chat-session';

export default class PrivateChatManager {
  constructor(signal, handler) {
    var cb = this.start.bind(this);

    var mute = () => signal.off('message', cb);
    var listen = () => signal.on('message', cb);

    Object.assign(this, { signal, handler, mute, listen });
  }
  async start(userId, offer) {
    this.mute();
    var streams = await start(this.signal, userId, offer);
    this.listen();
    var session = new ChatSession(userId, streams);
    this.handler(session);
    return session;
  }
}
