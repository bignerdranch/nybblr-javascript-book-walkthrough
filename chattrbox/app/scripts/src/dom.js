import $ from 'jquery';
import md5 from 'crypto-js/md5';

function createGravatarUrl(username) {
  let userhash = md5(username);
  userhash = userhash.toString();
  return `http://www.gravatar.com/avatar/${userhash}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formId, inputId) {
    this.formId = formId;
    this.inputId = inputId;
  }
  init(submitCallback) {
    let self = this;
    $(this.formId).submit((event) => {
      event.preventDefault();
      let val = $(self.inputId).val();
      submitCallback(val);
      $(self.inputId).val('');
    });
    $(this.formId).find('button').on('click', () => {
      $(this.formId).submit();
    });
  }
}

export class ChatList {
  constructor(listId, username) {
    this.listId = listId;
    this.odd = false;
    this.username = username;
  }
  drawMessage(messageData) {
    let $messageRow = $('<li>', {
      class: 'message-row'
    });
    let $message = $('<p>');
    $message.append($('<span>', {
      class: 'message-username',
      text: messageData.user
    }));
    $message.append($('<span>', {
      class: 'timestamp',
      'data-time': messageData.timestamp
    }));
    $message.append($('<span>', {
      class: 'message-message',
      text: messageData.message
    }));
    let $img = $('<img>', {
      src: createGravatarUrl(messageData.user),
      title: messageData.user
    });
    $messageRow.append($img);
    $messageRow.append($message);
    $(this.listId).append($messageRow);
    $messageRow.get(0).scrollIntoView();
  }
}
