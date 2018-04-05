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

app.post('/s/:id/comment', (request, response) => {
  const storyId = request.params.id;
  const parentId = request.body.parentId;
  const data = {
    body: request.body.body,
    poster: 'alex'
  };

  post
    .getPost(parentId)
    .then(parent => post.createComment(parent, data))
    .then(key => {
      console.log('test')
      response.redirect('/s/' + storyId);
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
