'use strict';

const express = require("express");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  var posts = [];

  for (var i = 0; i < 25; i++) {
    posts.push({
      rank: i + 1,
      title: "The New Law That Killed Craigslist’s Personals Could End the Web as We’ve Known",
      domain: "coindesk.com",
      score: 121,
      poster: "miyayes",
      age: "4 hours ago",
      comments: 5
    });
  }

  response.render('index', { posts: posts })
});

app.get('/post', (request, response) => {
  var post = {
    title: "The New Law That Killed Craigslist’s Personals Could End the Web as We’ve Known",
    domain: "coindesk.com",
    score: 121,
    poster: "miyayes",
    age: "4 hours ago",
    comments: 5
  }

  response.render('post', { post: post })
});

app.get('/');

exports.http = app;

exports.event = (event, callback) => {
  callback();
};

if (!process.env.GCLOUD_PROJECT) {
  app.listen(8080)
}
