import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["alert"],
  classNameBindings: ['typeClass'],
  typeTitle: Ember.computed('alertType', function() {
    return Ember.String.capitalize(this.get('alertType'));
  }),
  typeClass: Ember.computed('alertType', function() {
    return "alert-" + this.get('alertType');
  }),
  click() {
    this.get('close')();
  }
});
