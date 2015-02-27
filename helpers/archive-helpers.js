var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require("http");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */
exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../web/archives/sites'),
  'list' : path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths['list'], 'utf-8', function(err, data) {
    if (err) throw err;
    fs.writeFile(exports.paths['list'], "");
    data = data.split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(){
};


exports.addUrlToList = function(data){
  fs.appendFile(exports.paths['list'], data +"\n");
};

exports.isURLArchived = function(data, func1, func2){
  fs.exists(exports.paths['archivedSites'] + '/' + data, function (exists) {
    if (exists) {
      func1();
    } else {
      func2();
    }
  });
};

exports.saveData = function (html, siteName) {
  fs.writeFile(exports.paths['archivedSites'] + '/' + siteName, html);
};

exports.downloadUrls = function(data){
  var makeRequest = function (options) {
    http.get(options, function (res) {
      var text = '';
      res.on('data', function (chunk) {
        text += chunk.toString();
      });
      res.on('end', function () {
        exports.saveData(text, options.host)
      });
    });
  };
  _.each(data, function(siteName) {
    var options = {
      host: siteName,
      port: 80
    };
    fs.exists(exports.paths['archivedSites'] + '/' + siteName, function (exists) {
      if (!exists) {
        makeRequest(options);
      }
    })
  });

};
