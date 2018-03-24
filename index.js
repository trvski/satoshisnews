'use strict';

const express = require("express");

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  var posts = [
    {
      position: 1,
      title: "Blockchain bill passes: Smart Contracts Now Recognized Under Tennessee Law",
      domain: "coindesk.com",
      score: 121,
      poster: "miyayes",
      age: "4 hours ago",
      comments: 5
    },
    {
      position: 2,
      title: "America’s first blockchain property-title transfer has been recorded using the Ethereum blockchain",
      domain: "national.wfgnationaltitle.com",
      score: 129,
      poster: "GabeNewell_",
      age: "9 hours ago",
      comments: 5
    },
  ]

  response.render('index', { posts: posts })
})

app.get('/')

exports.http = app;

exports.event = (event, callback) => {
  callback();
};

if (!process.env.GCLOUD_PROJECT) {
  app.listen(8080)
}
