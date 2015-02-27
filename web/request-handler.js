var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers')
var fs = require('fs');
// require more modules/folders here!

var collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    data = data.split('=')[1];
    callback(data);
  });
};

var callbackHelper = function (res, dir, url, statusCode) {
  httpHelper.serveAssets(res, dir , url, function (string, encoding) {
    httpHelper.sendResponse(res, string, statusCode, encoding);
  });
};

var actions = {
  'GET': function(req, res){
    var dir;
    if (req.url === '/') {
      req.url = req.url + 'index.html';
    }
    fs.exists(archive.paths['siteAssets'] + req.url, function (exists) {
      if (exists) {
        dir = archive.paths['siteAssets'];
      } else {
        dir = archive.paths['archivedSites'];
      };
      httpHelper.serveAssets(res, dir , req.url, function (string, encoding) {
        httpHelper.sendResponse(res, string, 200, encoding);
      });
    })
  },
  'POST': function(req, res){
    collectData(req, function(data) {
      archive.isURLArchived(data, function(){
        exports.sendRedirect(res, '/' + data, 302)
      }, function(){
        archive.addUrlToList(data);
        exports.sendRedirect(res, '/loading.html', 302);
      });
    })
  },
  'OPTIONS': function(req, res){
    httpHelper.sendResponse('herro OPTIONS');
  }
};

exports.sendRedirect = function (res, location, statusCode) {
  res.writeHead(statusCode, {Location: location});
  res.end();
};


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if( action ){
    action(req, res);
  } else {
    httpHelper.sendResponse(res, "Not Found", 404);
  }
};

