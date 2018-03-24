'use strict';

const express = require("express");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

var data = {
  posts: []
}

for (var i = 0; i < 25; i++) {
  data.posts.push({
    rank: i + 1,
    title: "The New Law That Killed Craigslist’s Personals Could End the Web as We’ve Known",
    domain: "coindesk.com",
    score: 121,
    poster: "miyayes",
    age: "4 hours ago",
    comments: [
      {
        body: "The real story is he has no employment rights because he's in America and he's",
        score: 121,
        author: "miyayes",
        age: "4 hours ago",
        replies: [
          {
            body: "The real story is he has no employment rights because he's in America and he's",
            score: 121,
            author: "miyayes",
            age: "4 hours ago",
            replies: []
          },
          {
            body: "The real story is he has no employment rights because he's in America and he's",
            score: 121,
            author: "miyayes",
            age: "4 hours ago",
            replies: []
          },
          {
            body: "The real story is he has no employment rights because he's in America and he's",
            score: 121,
            author: "miyayes",
            age: "4 hours ago",
            replies: []
          },
          {
            body: "The real story is he has no employment rights because he's in America and he's",
            score: 121,
            author: "miyayes",
            age: "4 hours ago",
            replies: []
          }
        ]
      },
      {
        body: "The real story is he has no employment rights because he's in America and he's",
        score: 121,
        author: "miyayes",
        age: "4 hours ago",
        replies: []
      },
      {
        body: "The real story is he has no employment rights because he's in America and he's",
        score: 121,
        author: "miyayes",
        age: "4 hours ago",
        replies: []
      },
      {
        body: "The real story is he has no employment rights because he's in America and he's",
        score: 121,
        author: "miyayes",
        age: "4 hours ago",
        replies: []
      }
    ]
  });
}

app.get('/', (request, response) => {
  response.render('index', data)
});

app.get('/post', (request, response) => {
  response.render('post', {post: data.posts[0]})
});

app.get('/');

exports.http = app;

exports.event = (event, callback) => {
  callback();
};

if (!process.env.GCLOUD_PROJECT) {
  app.listen(8080)
}
