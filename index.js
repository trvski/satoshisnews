'use strict';

const express = require("express");
const post = require("./models/post");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
  post
    .getTopStories()
    .then(stories => {
      response.render('index', {stories: stories});
    });
});

app.get('/s/:id', (request, response) => {
  const id = request.params.id;

  post
    .getStoryAndComments(id)
    .then(data => {
      response.render('story', {
        story: data.story,
        comments: data.comments
      });
    });
});

app.get('/submit', (request, response) => {
  response.render('submit');
});

app.post('/submit', (request, response) => {
  post
    .createPost({
      title: request.body.title,
      body: request.body.body,
      url: request.body.url,
      poster: "alex"
    })
    .then(key => {
      response.redirect('/s/' + key.id);
    });
});


exports.http = app;

exports.event = (event, callback) => {
  callback();
};

if (!process.env.GCLOUD_PROJECT) {
  app.listen(8080)
}
