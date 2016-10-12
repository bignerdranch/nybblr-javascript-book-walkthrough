import $ from 'jquery';
import { ChatList, ChatForm } from './dom';
import { ChatMessage } from './app';

const template = document.querySelector('#chat-template').content;

export default class PrivateChatWindow {
  constructor(parent, session, store) {
    this.parent = $(parent)[0];
    this.session = session;
    this.store = store;
  }
  async init() {
    var chat = template.cloneNode(true);

    var user = await this.store.findUser(this.session.userId);
    var currentUser = await this.store.currentUser();

    chat.querySelector('[data-chat="user-name"]').innerText = user.name;

    var messages = chat.querySelector('[data-chat="message-list"]');
    var form = chat.querySelector('[data-chat="chat-form"]');
    var input = chat.querySelector('[data-chat="message-input"]');

    var local = chat.querySelector('[data-chat="local-stream"]');
    var remote = chat.querySelector('[data-chat="remote-stream"]');

    local.srcObject = this.session.local;
    remote.srcObject = this.session.remote;

    this.parent.appendChild(chat);

    var list = new ChatList(messages, currentUser.email);
    list.init();

    var form = new ChatForm($(form), $(input));
    form.init(text => {
      var data = {
        user: currentUser.email,
        message: text,
        timestamp: (new Date()).getTime()
      };
      this.session.send(data);
      list.drawMessage(data);
    });

    this.session.on('message', data => {
      let message = new ChatMessage(data);
      message.notify();
      list.drawMessage(message.serialize());
    });
  }
}
