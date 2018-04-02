module.exports = {
  getTopStories: getTopStories,
  getStoryAndComments: getStoryAndComments,
  getPosts: getPosts,
  getPost: getPost
}

const testPost = {
  id: "1",
  title: "title",
  body: "body",
  level: 0,
  domain: "abc.com",
  url: "http://www.asdasd.com/a",
  score: 100,
  poster: "username",
  age: "2 hours ago",
  replies: 1
};

const testComment = {
  id: "1.1",
  title: "title",
  body: "body",
  level: 1,
  domain: "abc.com",
  url: "http://www.asdasd.com/a",
  score: 100,
  poster: "username",
  age: "2 hours ago",
  replies: 0
}

function getTopStories () {
  return getPosts();
}

function getStoryAndComments () {
  return getPosts()
    .then(posts => {
      var posts = [testPost, testComment];
      return {
        story: posts.shift(),
        comments: posts
      }
    });
}

function getPosts (params) {
  return new Promise((resolve, reject) => {
    resolve([testPost]);
  });
}

function getPost (id) {
  return new Promise((resolve, reject) => {
    resolve(testPost);
  });
}
