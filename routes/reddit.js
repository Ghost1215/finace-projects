var express = require('express');
var router = express.Router();
var request = require('request');
//var schedule = require('node-schedule');
var cron = require('node-cron');

cron.schedule('* * * * *', () => {
 console.log('running a task every minute');
});

var url = "https://www.reddit.com/r/ProgrammerHumor/top.json"

/* 
Get method for ProgrammerHumor subreddit 
Link - /redditapi/PH
*/
router.get('/ph', function(req, res){

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(body) // Print the json response
            //console.log(body.data.children);
            res.json(body.data.children); // Send JSON data to user
        }
    })

});
module.exports = router;