var express = require('express');
var querystring = require('querystring');
var opn = require('opn');
var fs = require('fs');

var client_id = '62c9c6e0e0dd474b935452ba8676b2ec';
var redirect_uri = 'http://localhost:8080/callback';

var app = express();

app.get('/spotify', function(req, res) {
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'token',
      client_id: client_id,
      redirect_uri: redirect_uri,
    }));
    
});

app.get('/callback', function(req, res) {
  res.sendFile('callback.html', {root: __dirname});
});

app.listen(8080);

opn('http://localhost:8080/spotify', {app: 'chrome'});