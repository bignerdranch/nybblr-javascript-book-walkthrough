import $ from 'jquery';
import { ChatList, ChatForm } from './dom';

const template = $('[data-template="chat"]').html();

export default class PrivateChatWindow {
  constructor($parent, session) {
    this.$parent = $parent;
    this.session = session;
  }
  init() {
    var $el = $(template);
    $el.find('[data-chat="user-name"]')
      .text(this.session.userId);
    this.$parent.append($el);

    this.$el = $el;

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

    this.session.receive(data => {
      list.drawMessage(data);
    });
  }
}
