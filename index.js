'use strict';

const Datastore = require('@google-cloud/datastore');
const Post = require("./models/post");

const gstore = require('gstore-node')();
gstore.connect(new Datastore());

const express = require("express");
const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
  Post
    .getTopStories()
    .then(results => {
      response.render('index', results);
    });
});

app.get('/s/:storyId', (request, response) => {
  const { storyId } = request.params;

  Post
    .getStoryAndComments(storyId)
    .then(results => {
      response.render('story', results);
    });
});

app.post('/s/:storyId/comment', (request, response) => {
  const { storyId } = request.params;
  const { body, path } = request.body;

  Post
    .createComment({
        body: body,
        poster: 'alex',
        path: path
      })
    .then(comment => {
      response.redirect('/s/' + storyId);
    });
});

app.get('/submit', (request, response) => {
  response.render('submit');
});

app.post('/submit', (request, response) => {
  const { title, body, url } = request.body;

  Post
    .createStory({
      title: title,
      body: body,
      url: url,
      poster: "alex"
    })
    .then(story => {
      response.redirect('/s/' + story.id);
    });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
