'use strict';

const express = require("express");
const posts = require("./models/posts");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  posts
    .getTopPosts()
    .then(posts => {
      response.render('index', {posts: posts});
    });
});

app.get('/post/:id', (request, response) => {
  posts
    .getPost(request.param('id'))
    .then(post => {
      response.render('post', {post: post});
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
