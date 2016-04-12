import socket from './ws-client';
import {
  UserStore
} from './storage';
import {
  ChatForm,
  ChatList,
  promptForUsername
} from './dom';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  userStore.set(username);
}

class ChatApp {
  constructor() {
    this.chatForm = new ChatForm('#js-chat-form', '#js-message-input');
    this.chatList = new ChatList('#js-message-list', username);

    socket.init('ws://localhost:3001');
    socket.registerOpenHandler(() => {
      this.chatForm.init((data) => {
        let message = new ChatMessage(data);
        socket.sendMessage(message.toObj());
      });
    });
    socket.registerMessageHandler((data) => {
      console.log(data);
      let message = new ChatMessage(data);
      this.chatList.drawMessage(message.toObj());
    });
  }
}
class ChatMessage {
  constructor(data) {
    if (typeof data === 'string') {
      data = {
        message: data
      };
    }
    this.username = data.user || username;
    this.message = data.message;
    this.timestamp = data.timestamp || (new Date()).getTime();
  }

  toObj() {
    return {
      user: this.username,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

export default ChatApp;
