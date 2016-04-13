import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [{
      id: 1,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }, {
      id: 2,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }, {
      id: 3,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }, {
      id: 4,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }, {
      id: 5,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }, {
      id: 6,
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    }];
  }
});
