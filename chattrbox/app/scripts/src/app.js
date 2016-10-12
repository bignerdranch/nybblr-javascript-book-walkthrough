import 'babel-polyfill';
import socket from './ws-client';
import Signal from './signal';
import Store from './store';
import {
  ChatForm,
  ChatList,
  UserList,
  promptForUsername
} from './dom';
import { start } from './peer-connection';
import PrivateChatManager from './private-chat-manager';
import PrivateChatWindow from './private-chat-window';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';
const USER_LIST_SELECTOR = '[data-chat="user-list"]';

const secure = location.protocol === 'https:';
const WS_HOST = `${secure ? 'wss' : 'ws'}://${location.host}`;

let username;

class ChatApp {
  constructor() {
    this.init();
  }
  async init() {
    Notification.requestPermission();

    var store = new Store();
    var user = await store.currentUser();
    console.log('Current user:');
    console.log(user);

    username = user.email;

    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);
    this.userList = new UserList(USER_LIST_SELECTOR, username, store);

    var signal = Signal(`${WS_HOST}/signal`);
    window.signal = signal;
    window.start = start;

    var privateChat = new PrivateChatManager(signal, session => {
      new PrivateChatWindow('body', session, store).init();
    });
    privateChat.listen();

    this.userList.init(userId => {
      privateChat.start(userId);
    });

    socket.init(WS_HOST);
    socket.registerOpenHandler(() => {
      this.chatForm.init((data) => {
        let message = new ChatMessage({
          message: data
        });
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });
    socket.registerMessageHandler((data) => {
      console.log(data);
      let message = new ChatMessage(data);
      message.notify();
      this.chatList.drawMessage(message.serialize());
    });
  }
}
export class ChatMessage {
  constructor({
    message: m,
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }
  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
  notify() {
    if (this.user === username) { return; }
    var notification = new Notification(this.user, {
      body: this.message
    });

    setTimeout(() => {
      notification.close();
    }, 3000);

    return notification;
  }
}
export default ChatApp;
