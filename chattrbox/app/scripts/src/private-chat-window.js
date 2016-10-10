import $ from 'jquery';
import { ChatList, ChatForm } from './dom';

const template = document.querySelector('#chat-template').content;

export default class PrivateChatWindow {
  constructor($parent, session) {
    this.$parent = $parent;
    this.session = session;
  }
  init() {
    var clone = template.cloneNode(true);
    var el = clone.firstElementChild;
    this.$parent.append(clone);
    var $el = $(el);

    this.$el = $el;

    $el.find('[data-chat="user-name"]')
      .text(this.session.userId);

    var $messages = $el.find('[data-chat="message-list"]');
    var list = new ChatList($messages, '');
    list.init();

    var $form = $el.find('[data-chat="chat-form"]');
    var $input = $el.find('[data-chat="message-input"]');
    var form = new ChatForm($form, $input);
    form.init(text => {
      var data = {
        user: this.session.userId,
        message: text,
        timestamp: (new Date()).getTime()
      };
      this.session.send(data);
      list.drawMessage(data);
    });

    this.session.on('message', data => {
      list.drawMessage(data);
    });

    var local = el.querySelector('[data-chat="local-stream"]');
    var remote = el.querySelector('[data-chat="remote-stream"]');

    local.srcObject = this.session.local;
    remote.srcObject = this.session.remote;
  }
}
