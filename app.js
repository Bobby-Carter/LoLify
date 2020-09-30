var express = require('express');
var querystring = require('querystring');
var opn = require('open');
var fs = require('fs');

var client_id = '62c9c6e0e0dd474b935452ba8676b2ec';
var redirect_uri = 'http://localhost:8080/callback';

var app = express();


//Home page
app.get('/', function(req, res) {
  res.sendFile('home.html', {root: __dirname});
});


//Page to ask user for spotify credentials.
//Once user authorizes with spotify, redirects to /callback
app.get('/spotify', function(req, res) {
  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'token',
      client_id: client_id,
      redirect_uri: redirect_uri,
    }));
    
});



//Page with spotify access token in the url as a #fragment
app.get('/callback', function(req, res) {
  res.sendFile('callback.html', {root: __dirname});
});


//Keep server running on local host 8080
app.listen(8080);
//Open a browser to the homepage
opn('http://localhost:8080');