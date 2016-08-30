import 'babel-polyfill';
import $ from 'jquery';
import md5 from 'crypto-js/md5';
import moment from 'moment';

function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formSel, inputSel) {
    this.$form = $(formSel);
    this.$input = $(inputSel);
  }
  init(submitCallback) {
    this.$form.submit((event) => {
      event.preventDefault();
      let val = this.$input.val();
      submitCallback(val);
      this.$input.val('');
    });
    this.$form.find('button').on('click', () => this.$form.submit());
  }
}

export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
  }
  drawMessage({
    user: u,
    timestamp: t,
    message: m
  }) {
    let $messageRow = $('<li>', {
      'class': 'message-row'
    });
    if (this.username === u) {
      $messageRow.addClass('me');
    }
    let $message = $('<p>');
    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    }));
    $message.append($('<span>', {
      'class': 'timestamp',
      'data-time': t,
      text: moment(t).fromNow()
    }));
    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    }));
    let $img = $('<img>', {
      src: createGravatarUrl(u),
      title: u
    });
    $messageRow.append($img);
    $messageRow.append($message);
    this.$list.append($messageRow);
    $messageRow.get(0).scrollIntoView();
  }
  init() {
    this.timer = setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr('data-time'));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }
}

export class UserList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
  }
  async init() {
    var response = await fetch('api/users');
    var users = await response.json();
    for (let user of users) {
      this.drawUser(user);
    }
  }
  drawUser({ email, name }) {
    let $userRow = $('<li>', {
      class: 'user-row',
      'data-user': email
    });
    if (this.username === email) {
      $messageRow.addClass('me');
    }
    let $userName = $('<a>', {
      href: '#',
      text: name
    });
    let $img = $('<img>', {
      src: createGravatarUrl(email),
      title: name
    });
    $userRow.append($img);
    $userRow.append($userName);
    this.$list.append($userRow);
  }
}
