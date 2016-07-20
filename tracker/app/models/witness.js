import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  hasMany
} from 'ember-data/relationships';

export default Model.extend({
  fName: attr('string'),
  lName: attr('string'),
  email: attr('string'),
  sightings: hasMany('sighting'),
  fullName: Ember.computed('fName', 'lName', function() {
    return this.get('fName') + ' ' + this.get('lName');
  })

});
