import Ember from 'ember';

export default Ember.Controller.extend({
  alertMessage: null,
  alertType: '',
  isAlertShowing: null,
  actions: {
    removeAlert: function() {
      this.set('alertMessage', "");
      this.set('alertType', "success");
      this.set('isAlertShowing', false);
    }
  }
});
