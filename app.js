// Require Modules
var db = require('orchestrate')(process.env.API_KEY)
var schedule = require('node-schedule');

// Setup Rule
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 14;
rule.minute = 0;

// Loop Through Orchestrate Collection
db.list('subscribers')
  .then(function (result) {
    var data = result.body.results;
    console.log(data);
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        console.log(data[key].key);
      }
    }
  })
  .fail(function (err) {
    console.log(err)
  })
