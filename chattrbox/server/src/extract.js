var path = require('path');
var extractFilePath = function(url) {
  var fileName = 'index.html';
  if (url.length > 1) {
    fileName = url.substring(1);
  }
  console.log('The fileName is: ' + fileName);
  return fileName;
};

module.exports = extractFilePath;
