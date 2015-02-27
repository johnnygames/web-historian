var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var fileExtensions = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript'
};

exports.send404 = function(res) {
  exports.sendResponse(res, '', 404, 'text/html');
};

exports.serveAssets = function(res, dir, asset, callback) {
  var encoding = fileExtensions[path.extname(asset)];
  var func = callback;
  var html = fs.readFile(dir + asset, 'utf-8', function (err, string) {
    if (err) {
      exports.send404(res);
    } else {
      func(string, encoding);
    }
  });
};

exports.sendResponse = function(res, data, statusCode, encoding){ //modularize sending a response with basic-server.js
  statusCode = statusCode || 200;
  encoding = encoding || 'text/html';
  headers['Content-Type'] = encoding;
  res.writeHead(statusCode, headers);
  res.end(data);
};

// As you progress, keep thinking about what helper functions you can put here!