// Require Modul
var express = require('express');
var app = express();
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY)
var request = require('superagent');
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Setup Express
var port = process.env.PORT || 3000;
app.listen(port);


// Get Top Post of Day from Imgur
function getTopPost(cb) {
  request
    .get('https://api.imgur.com/3/gallery/top/top/day/1?showViral=false')
    .set('Authorization', 'Client-ID ' + process.env.IMGUR_CLIENT_ID)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if(err) {
        console.log(err);
      } else {
        item = JSON.parse(res.text).data[0];
        cb([item.title, item.link]);
      }
    })
}


// Send MMS to Subscriber
function sendMMS(recipient) {
  getTopPost(function(post) {
    client.sendMessage({
      to: recipient,
      body: post[0],
      mediaUrl: post[1],
      from: process.env.TWILIO_NUMBER
    }, function(err, messageData) {
        if (err) {
          console.error(err);
        }
    });
  })
}


// Routes
app.get('/', function(req, res) {
  console.log('lol')
  res.sendStatus(200);
});

app.get('/daily', function(req, res) {
  res.sendStatus(200);
  // db.list('subscribers')
  //   .then(function (result) {
  //     var data = result.body.results;
  //     data.forEach(function(obj) { sendMMS(obj.path.key); })
  //   })
  //   .fail(function (err) {
  //     console.log(err)
  //   })
  client.sendMessage({
    to: '+1 214 436 1433',
    body: 'test',
    mediaUrl: 'http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg',
    from: process.env.TWILIO_NUMBER
  }, function(err, messageData) {
      if (err) {
        console.error(err);
      } else {
        console.log(messageData)
        console.log('lelelelelele')
      }
  });
});
