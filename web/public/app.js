$(function () {
  var filename;
  $('#document').submit(function () {
    filename = $('#input').val();
  });
  $.ajax({
    url: 'http://127.0.0.1:8080/',
    type: 'POST',
    data: filename,
    contentType: 'text'
  });
});