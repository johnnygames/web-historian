// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');

var doWork = function () {
  archive.readListOfUrls(function (data) {
    data = data.split('\n');
    archive.downloadUrls(data);
  });
}

doWork();