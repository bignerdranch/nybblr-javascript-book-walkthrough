import Ember from 'ember';

export function momentFrom(params) {
  var time = window.moment(...params);
  var formated = time.fromNow();
  return new Ember.Handlebars.SafeString('<span class="text-primary">' + formated + '</span>');
}

export default Ember.Helper.helper(momentFrom);
