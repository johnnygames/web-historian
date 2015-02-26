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

exports.serveAssets = function(res, asset, callback) {
  if (asset === '/') {
    asset = asset + 'index.html';
  }
  var encoding = fileExtensions[path.extname(asset)];
  var func = callback;
  var html = fs.readFile(__dirname+'/'+'public' + asset, 'utf-8', function (err, string) {
    func(string, encoding);
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