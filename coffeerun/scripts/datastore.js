(function(window) {
  'use strict';
  var App = window.App || {};
  var Promise = window.Promise;

  function DataStore() {
    this.data = {};
  }

  DataStore.prototype.add = function(key, val) {
    this.data[key] = val;
    var promise = new Promise(function(resolve, reject) {
      this.data[key] = val;
      resolve();
    }.bind(this));

    return promise;
  };
  DataStore.prototype.get = function(key) {
    var promise = new Promise(function(resolve, reject) {
      resolve(this.data[key]);
    }.bind(this));

    return promise;
  };
  DataStore.prototype.getAll = function() {
    var promise = new Promise(function(resolve, reject) {
      resolve(this.data);
    }.bind(this));
    return promise;
  };
  DataStore.prototype.remove = function(key) {
    var promise = new Promise(function(resolve, reject) {
      delete this.data[key];
      resolve();
    }.bind(this));
    return promise;
  };

  App.DataStore = DataStore;
  window.App = App;
})(window);
