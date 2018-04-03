const Datastore = require('@google-cloud/datastore');

module.exports = {
  getTopStories: getTopStories,
  getStoryAndComments: getStoryAndComments,
  getAllPosts: getAllPosts,
  getPost: getPost
}

const projectId = 'satoshisnews';
const datastore = new Datastore();

function createPost (data) {
  const key = datastore.key('Post');
  const post = {
    key: key,
    data: {
      title: data.title || "",
      body: data.body || "",
      level: data.level || 0,
      url: data.url || "",
      score: data.score || 0,
      poster: data.poster || "",
      time: data.time || Date.now(),
      descendents: data.descendents || 0,
      children: data.children || 0
    }
  };

  return datastore
    .save(post)
    .then(() => {
      console.log(`Saved ${post.key.name}: ${post.data.description}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

// createPost({
//   title: "title",
//   url: "http://www.asdasd.com/a",
//   poster: "username"
// })

function getTopStories () {
  const query = datastore
    .createQuery('Post')
    .filter('level', '=', 0);

  return datastore
    .runQuery(query)
    .then(results => {
      return results[0];
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getStoryAndComments (id) {
  const query = datastore
    .createQuery('Post')
    .filter('__key__', '>=', datastore.key(['Post', parseInt(id)]));

  return datastore
    .runQuery(query)
    .then(results => {
      return {
        story: results[0].shift(),
        comments: results[0]
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getAllPosts () {
  const query = datastore
    .createQuery('Post')
    .order('created');

  return datastore
    .runQuery(query)
    .then(results => {
      return results[0];
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getPost (id) {
  const key = datastore.key(['Post', parseInt(id)]);

  datastore
    .get(key)
    .then(post => {
      return post;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
