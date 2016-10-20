import 'babel-polyfill';
import socket from './ws-client';
import {
  UserStore
} from './storage';
import {
  ChatForm,
  ChatList,
  UserList,
  promptForUsername
} from './dom';
import { getJSON } from './fetch';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';
const USER_LIST_SELECTOR = '[data-chat="user-list"]';

let username;

class ChatApp {
  constructor() {
    this.init();
  }
  async init() {
    var user = await getJSON('api/users/me');
    username = user.email;

    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);
    this.userList = new UserList(USER_LIST_SELECTOR, username);

    this.userList.init();

    socket.init('ws://' + location.host);
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
      this.chatList.drawMessage(message.serialize());
    });
  }
}
class ChatMessage {
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
}
export default ChatApp;
