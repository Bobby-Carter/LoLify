var express = require('express');
var querystring = require('querystring');
var opn = require('open');
var fs = require('fs');
var https = require('https')

var client_id = '62c9c6e0e0dd474b935452ba8676b2ec';
var redirect_uri = 'http://localhost:8080/callback';

var riotAPIKey = 'RGAPI-b52ea49e-78a6-44ed-8104-84cecf43f558';
var riotAccountId = 'start';

var app = express();



riotCallback = function(res) {
  let data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
    
  res.on('end', function () {
    console.log(data);
    riotAccountId = data;
  });
}

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


//Route that handles Riot games API calls and returns relevant information
app.get('/getSummoner', function(req, res) {
  
  //Configure options/setup request to Riot games API
  let url = new URL('http://localhost:8080' + req.url).searchParams;
  let options = {
    host: 'na1.api.riotgames.com', 
    path: '/lol/summoner/v4/summoners/by-name/' +
      encodeURI(url.get('summonername')) +
      '?api_key=' + riotAPIKey,
    method: 'GET'
  };
  
  //Make request to Riot games API
  const request = https.request(options, (response) => {
    //Receive chunks of data and append them to string
    let data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    
    //When no more chunks left
    response.on('end', function () {
      res.send(JSON.parse(data).accountId); //Send account Id to localhost/getSummoner route
    });
  });
  request.end();
  
  
  /* LEGACY
  let url = new URL('http://localhost:8080' + req.url).searchParams;
  
  res.redirect('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
    encodeURI(url.get('summonername')) +
    '?api_key=' + riotAPIKey
  );
  
  //console.log();
  
  //res.redirect('/home');
  */
  
});


//Keep server running on local host 8080
app.listen(8080);
//Open a browser to the homepage
opn('http://localhost:8080');