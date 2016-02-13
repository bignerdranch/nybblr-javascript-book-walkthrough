let $ = require('jquery');

let md5 = require('crypto-js/md5');

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
    $(this.formId).submit((event) => {
      event.preventDefault();
      let val = $(this.inputId).val();
      submitCallback(val);
      $(this.inputId).val('');
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
    var $messageRow = $('<li>', {
      class: 'message-row'
    });
    var $message = $('<p>');
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
    $messageRow.append($message);

    var $img = $('<img>', {
      src: createGravatarUrl(messageData.user),
      title: messageData.user
    });
    $messageRow.append($img);

    $(this.listId).append($messageRow);
    $messageRow.get(0).scrollIntoView();
  }
}
