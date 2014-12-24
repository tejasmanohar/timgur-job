// Log All Uncaught Exceptions
process.on('uncaughtException', function(err) {
  console.log(err);
});


// Require Modules
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY)
var request = require('superagent');
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Iterate through Orchestrate Collection
setInterval(function(){ 
  db.list('subscribers')
    .then(function (result) {
      var data = result.body.results;
      data.forEach(function(obj) { sendMMS(obj.path.key); })
    })
    .fail(function (err) {
      console.log(err)
    })
}, 86400000);


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
