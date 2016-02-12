(function(window) {
  'use strict';
  var App = window.App || {};

  function Truck(truckId, db) {
    this.truckId = truckId;
    this.db = db;
  }
  Truck.prototype.createOrder = function(order) {
    console.log('Adding order for ' + order.email);
    return this.db.add(order.email, order);
  };
  Truck.prototype.deliverOrder = function(customerId) {
    console.log('Delivering order for ' + customerId);
    return this.db.remove(customerId);
  };
  Truck.prototype.printOrders = function(printFn) {
    this.db.getAll()
      .then(function(allData) {
        var customerIdArray = Object.keys(allData);
        console.log('Truck #' + this.truckId + ' has pending orders:');
        customerIdArray.forEach(function(id) {
          console.log(allData[id]);
          if (printFn) {
            printFn(allData[id]);
          }
        }.bind(this));
      }.bind(this));
  };

  App.Truck = Truck;
  window.App = App;
})(window);
