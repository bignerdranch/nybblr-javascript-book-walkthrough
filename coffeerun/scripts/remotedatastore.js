(function(window) {
  'use strict';
  var App = window.App || {};

  function RemoteDataStore(url) {
    if (!url) {
      throw new Error('No remote URL supplied.');
      return;
    }
    this.serverUrl = url;
  }
  RemoteDataStore.prototype.add = function(key, val) {
    $.post(this.serverUrl, val, function(serverResponse) {
      console.log(serverResponse);
    });
  };
  RemoteDataStore.prototype.getAll = function() {
    $.get(this.serverUrl, function(serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });
  };
  RemoteDataStore.prototype.get = function(key, cb) {
    $.get(this.serverUrl + '/' + key, function(serverResponse) {
      console.log(serverResponse);
      cb(serverResponse);
    });
  };
  RemoteDataStore.prototype.remove = function(key) {
    $.ajax(this.serverUrl + '/' + key, {
      type: 'DELETE'
    });
  };

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
