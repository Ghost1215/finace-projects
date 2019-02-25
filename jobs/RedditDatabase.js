var request = require('request');
var RedditPF = require('../models/Reddit/PopularFunny.js');
var RedditNews = require('../models/Reddit/News.js');
var Reddit = require('../models/Reddit/RedditAll.js');

var urlsPop = [
  "https://www.reddit.com/r/ProgrammerHumor/.json", 
  "https://www.reddit.com/r/softwaregore/.json"];

var urlsNews = [
  "https://www.reddit.com/r/technology/.json",
  "https://www.reddit.com/r/Futurology/.json"];

exports.pop = function () {

  console.log('\x1b[32m%s\x1b[0m', 'INFO: Updating Reddit popular results');

  // Delete old data
  RedditPF.remove({}, function(err,removed) {});

  for(var i = 0; i < urlsPop.length; i++) {
    var posts = [];
    var completed_requests = 0;

    request({
      url: urlsPop[i],
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = body.data.children;

        completed_requests++;

        var counter = 0;
        for(var i = 0; i < jsonData.length; i++) {
          var obj = jsonData[i].data;
          var thumbnailTemp;
          var picTemp;

          if(obj.stickied == false) {
            if(obj.thumbnail == "" || obj.thumbnail == "self"){
                thumbnailTemp = "http://localhost:3000/api/assets/images/laughCry.JPEG";
                picTemp = "";
            }else{
                thumbnailTemp = obj.thumbnail;
                picTemp = obj.url;
            }

            if(obj.url.indexOf(".png") > -1 || obj.url.indexOf(".jpg") > -1){
              picTemp = obj.url;
            }else{
              picTemp = "";
            }

            posts.push({
              id: obj.id,
              title: obj.title,
              url: obj.url,
              pic: picTemp,
              thumbnail: thumbnailTemp,
              selftext: obj.selftext,
              subreddit: obj.subreddit,
              score: obj.score
            });

            counter++;
          }

          if(counter == 10) {
              break;
          }
        }
      }

      if(completed_requests == urlsPop.length){

        posts.sort(function (a, b) {return b.score - a.score;});

        for(var i = 0; i < posts.length; i++) {
          var newRedditPostPF = new RedditPF({
            _id: posts[i].id,
            title: posts[i].title,
            url: posts[i].url,
            pic: posts[i].pic,
            thumbnail: posts[i].thumbnail,
            selftext: posts[i].selftext,
            subreddit: posts[i].subreddit,
        });

        // Save new data to mongoDB
        newRedditPostPF.save(function (err) {if (err) {}});

        var newRedditPost = new Reddit({
          _id: posts[i].id,
          title: posts[i].title,
          url: posts[i].url,
          pic: posts[i].pic,
          thumbnail: posts[i].thumbnail,
          selftext: posts[i].selftext,
          subreddit: posts[i].subreddit
        });
          
        // Save new data to mongoDB
        newRedditPost.save(function (err) {if (err) {}});
        }
      }
    })
  }
};

exports.news = function () {
  
  console.log('\x1b[32m%s\x1b[0m', 'INFO: Updating Reddit News results');

  // Delete old data
  RedditNews.remove({}, function(err,removed) {});

  for(var i = 0; i < urlsNews.length; i++) {
    var posts = [];
    var completed_requests = 0;

    request({
      url: urlsNews[i],
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = body.data.children;

        completed_requests++;

        var counter = 0;
        for(var i = 0; i < jsonData.length; i++) {
          var obj = jsonData[i].data;
          var thumbnailTemp;
          var picTemp;

          if(obj.stickied == false) {
            if(obj.thumbnail == "" || obj.thumbnail == "self"){
                thumbnailTemp = "http://localhost:3000/api/assets/images/techNews.jpg";
            }else{
                thumbnailTemp = obj.thumbnail;
            }

            if(obj.url.indexOf(".png") > -1 || obj.url.indexOf(".jpg") > -1){
              picTemp = obj.url;
            }else{
              picTemp = "";
            }

            posts.push({
              id: obj.id,
              title: obj.title,
              url: obj.url,
              pic: picTemp,
              thumbnail: thumbnailTemp,
              selftext: obj.selftext,
              subreddit: obj.subreddit,
              score: obj.score
            });
  
            counter++;
          }

          if(counter == 10) {
              break;
          }
        }
      }

      if(completed_requests == urlsNews.length){

        posts.sort(function (a, b) {return b.score - a.score;});

        for(var i = 0; i < posts.length; i++) {
          var newRedditPostNews = new RedditNews({
            _id: posts[i].id,
            title: posts[i].title,
            url: posts[i].url,
            pic: posts[i].pic,
            thumbnail: posts[i].thumbnail,
            selftext: posts[i].selftext,
            subreddit: posts[i].subreddit,
        });

        // Save new data to mongoDB
        newRedditPostNews.save(function (err) {if (err) {}});

        var newRedditPost = new Reddit({
          _id: posts[i].id,
          title: posts[i].title,
          url: posts[i].url,
          pic: posts[i].pic,
          thumbnail: posts[i].thumbnail,
          selftext: posts[i].selftext,
          subreddit: posts[i].subreddit
        });
          
        // Save new data to mongoDB
        newRedditPost.save(function (err) {if (err) {}});
        }
      }
    })
  }
};