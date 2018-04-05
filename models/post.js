const Datastore = require('@google-cloud/datastore');

const projectId = 'satoshisnews';
const datastore = new Datastore();

module.exports = {
  getTopStories: getTopStories,
  getStoryAndComments: getStoryAndComments,
  getAllPosts: getAllPosts,
  getPost: getPost,
  createPost: createPost,
  createComment: createComment
}

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
      poster: data.poster,
      time: Date.now(),
      descendents: 0,
      children: 0
    }
  };

  return datastore
    .save(post)
    .then((results) => {
      console.log(`Saved ${post.data.title}`);
      return key;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function createComment (parent, data) {
  if (!parent) {
    throw new Error('parent must be defined.');
  }

  ['body', 'poster'].forEach(property => {
    if (!data[property]) {
      throw new Error(`${property} must be defined.`);
    }
  })

  const parentKey = parseInt(parent.id);
  const commentKey = datastore.key(['Post', parentKey, 'Post']);
  const comment = {
    body: data.body,
    poster: data.poster,
    level: parent.level + 1,
    time: Date.now(),
    title: null,
    url: null,
    score: 0,
    descendents: 0,
    children: 0
  }

  return datastore
    .save({
      key: commentKey,
      data: comment
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getTopStories () {
  const query = datastore
    .createQuery('Post')
    .filter('level', '=', 0);

  return datastore
    .runQuery(query)
    .then(preparePosts)
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getStoryAndComments (id) {
  const query = datastore
    .createQuery('Post')
    .hasAncestor(datastore.key(['Post', parseInt(id)]))
    .order('__key__');

    return datastore
      .runQuery(query)
      .then(preparePosts)
      .then(([story, ...comments] = posts) => {
        console.log(comments);
        return {
          story: story,
          comments: comments
        }
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
}

function getAllPosts () {
  const query = datastore
    .createQuery('Post');

  return datastore
    .runQuery(query)
    .then(preparePosts)
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getStory (id) {
  return getPost(id);
}

function getPost (id) {
  const key = datastore.key(['Post', parseInt(id)]);

  return datastore
    .get(key)
    .then(([post] = result) => post)
    .then(preparePost)
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function preparePosts (results) {
  if (!results[0]) {
    return [];
  }

  return results[0].map(preparePost)
}

function preparePost (object) {
  return {
    id: object[datastore.KEY].id,
    title: object.title,
    body: object.body,
    level: object.level,
    url: object.url,
    score: object.score,
    poster: object.poster,
    time: object.time,
    descendents: object.descendents,
    children: object.children
  }
}
