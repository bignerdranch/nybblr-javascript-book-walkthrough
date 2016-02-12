import socket from './ws-client';

class ChatApp {
  constructor() {
    socket.init('ws://localhost:3001');
    socket.registerOpenHandler(() => {
      let message = new ChatMessage('pow!');
      socket.sendMessage(message.toObj());
    });
    socket.registerMessageHandler((data) => {
      console.log(data);
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
    this.username = data.user || 'batman';
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
