// Require Modules
// var db = require('orchestrate')(process.env.API_KEY)
var request = require('superagent');
var schedule = require('node-schedule');
var twilio = require('twilio');


// // Setup Rule
// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(0, 6)];
// rule.hour = 14;
// rule.minute = 0;


// Get Top Post of Day from Imgur
function getTopPostUrl() {
  request
    .get('https://api.imgur.com/3/gallery/top/top/day/1?showViral=false')
    .set('Authorization', 'Client-ID ' + process.env.IMGUR_CLIENT_ID)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if(err) {
        console.log(err);
      } else {
        json = JSON.parse(res.text);
        console.log(json.data[0].link);
      }
    });
}
getTopPostUrl();
// Send MMS to Subscriber


// // Loop through Orchestrate Collection
// db.list('subscribers')
//   .then(function (result) {
//     var data = result.body.results;
//     data.forEach(function(obj) { console.log(obj.path.key); })
//   })
//   .fail(function (err) {
//     console.log(err)
//   })
