import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
} from 'ember-data/relationships';

export default Model.extend({
  location: attr('string'),
  createdAt: attr('date'),
  sightedAt: attr('date'),
  cryptid: belongsTo('cryptid'),
  witnesses: hasMany('witness')
});
