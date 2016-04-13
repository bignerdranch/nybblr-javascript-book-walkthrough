import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let record1 = this.store.createRecord('sighting', {
      location: 'Atlanta',
      sightedAt: new Date('2012-10-24')
    });
    let record2 = this.store.createRecord('sighting', {
      location: 'Calloway',
      sightedAt: new Date('2012-09-24')
    });
    let record3 = this.store.createRecord('sighting', {
      location: 'Asilomar',
      sightedAt: new Date('2012-12-24')
    });
    return [record1, record2, record3];
  }
});
