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
    callback(data['filename']);
  });
};
var callbackHelper = function (res, dir, url) {
  httpHelper.serveAssets(res, dir , url, function (string, encoding) {
    httpHelper.sendResponse(res, string, 200, encoding);
  });
};
var actions = {
  'GET': function(req, res){
    httpHelper.serveAssets(res, '/public' ,req.url, function (string, encoding) {
      httpHelper.sendResponse(res, string, 200, encoding);
    });
  },
  'POST': function(req, res){
    collectData(req, function(data) {
      if (fs.exists('./archives/site/' + data)) {
        httpHelper.serveAssets(res, './archives/site', '/'+ data, function(string, encoding) {
          httpHelper.sendResponse(res, string, 201, encoding);
        });
      } else {
        httpHelper.serveAssets(res, '/public', '/loading.html', function(string, encoding) {
          httpHelper.sendResponse(res, string, 201, encoding);
        });
      }
    });
    // httpHelper.sendResponse(res, 'something', 201);
  },
  'OPTIONS': function(req, res){
    httpHelper.sendResponse('herro OPTIONS');
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if( action ){
    action(req, res);
  } else {
    httpHelper.sendResponse(res, "Not Found", 404);
  }
};

