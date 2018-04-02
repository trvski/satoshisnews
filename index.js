'use strict';

const express = require("express");
const post = require("./models/post");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  post
    .getTopStories()
    .then(stories => {
      response.render('index', {stories: stories});
    });
});

app.get('/s/:id', (request, response) => {
  post
    .getStoryAndComments(request.params.id)
    .then(data => {
      response.render('story', {story: data.story, comments: data.comments});
    });
});

app.get('/');

exports.http = app;

exports.event = (event, callback) => {
  callback();
};

if (!process.env.GCLOUD_PROJECT) {
  app.listen(8080)
}
