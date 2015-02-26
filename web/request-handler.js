var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers')
// require more modules/folders here!

var actions = {
  'GET': function(req, res){
    httpHelper.serveAssets(res, req.url, function (string, encoding) {
      httpHelper.sendResponse(res, string, 200, encoding);
    });
  },
  'POST': function(req, res){
    httpHelper.sendResponse(res, 'something', 201);
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