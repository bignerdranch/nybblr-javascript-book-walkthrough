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
    return $.post(this.serverUrl, val, function(serverResponse) {
      console.log(serverResponse);
    });
  };
  RemoteDataStore.prototype.getAll = function() {
    return $.get(this.serverUrl, function(serverResponse) {
      console.log(serverResponse);
    });
  };
  RemoteDataStore.prototype.get = function(key) {
    return $.get(this.serverUrl + '/' + key, function(serverResponse) {
      console.log(serverResponse);
    });
  };
  RemoteDataStore.prototype.remove = function(key) {
    return $.ajax(this.serverUrl + key, {
      type: 'DELETE'
    });
  };

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
