const hn = require("node-hn-api");

module.exports = {
  getTopPosts: getTopPosts,
  getPost: getPost
}

function getTopPosts () {
  return hn
  .fetchTopStories(20)
  .then(topStories => {
    return topStories.map(mapStoryToPost);
  })
  .catch(err => {
    console.error(err)
  });
}

function mapStoryToPost (story, index) {
  console.log(story);
  var post = {
    id: story.id,
    rank: index + 1,
    title: story.title,
    domain: "abc.com",
    url: story.url,
    score: story.score,
    poster: story.by,
    age: "2 hours ago",
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
          }
        ]
      }
    ]
  };

  return post;
}

function getPost (id) {
  return hn
  .fetchItem(id)
  .then(story => {
    return mapStoryToPost(story);
  })
  .catch(err => {
    console.error(err)
  });
}
