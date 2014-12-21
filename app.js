// Require Modules
// var db = require('orchestrate')(process.env.API_KEY)
var request = require('superagent');
var schedule = require('node-schedule');
var twilio = require('twilio');


// Setup Rule
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 14;
rule.minute = 0;

var j = schedule.scheduleJob(date, function(){
  db.list('subscribers')
    .then(function (result) {
      var data = result.body.results;
      data.forEach(function(obj) { sendMMS(obj.path.key); })
    })
    .fail(function (err) {
      console.log(err)
    })
});


// Get Top Post of Day from Imgur
function getTopPost() {
  return request
    .get('https://api.imgur.com/3/gallery/top/top/day/1?showViral=false')
    .set('Authorization', 'Client-ID ' + process.env.IMGUR_CLIENT_ID)
    .set('Accept', 'application/json')
}

getTopPost().end(function(err, res) {
    item = JSON.parse(res.text).data[0];
    return [item.title, item.link];
});


// Send MMS to Subscriber
function sendMMS(recipient) {
  var post = getTopPost();
  client.sendMessage({
    to: recipient,
    body: post[0],
    mediaUrl: post[1],
    from: process.env.TWILIO_NUMBER
  }, function(err, messageData) {
      if (err) {
        console.error(err);
      } else {
        console.log('Message sent to ' + recipient);
      }
  });
}
