const gstore = require('gstore-node')();

const { Schema } = gstore;

const schema = new Schema({
  level: { type: 'int', required: true },
  descendents: { type: 'int', default: 0, required: true },
  createdOn: { type: 'datetime', default: gstore.defaultValues.NOW },
  modifiedOn: { type: 'datetime' },
  poster: { type: 'string', required: true },
  title: { type: 'string', default: null },
  body: { type: 'string', default: null },
  url: { type: 'string', default: null  },
  score: { type: 'int', default: 0, required: true },
}, {
  queries: {
    format: 'ENTITY'
  }
});

schema.virtual('path').get(function getPath () {
  return this[gstore.ds.KEY].path
    .filter(e => e != 'Post')
    .join('/');
});

schema.pre('save', function updateAncestors () {
  const ancestorKeys = (function parentKeys (key) {
    if (!key.parent) return [];

    return [key.parent.path].concat(parentKeys(key.parent));
  })(this.entityKey);

  return Promise.all(ancestorKeys.map(key => {
    return this.model('Post')
      .get(key)
      .then(([post] = posts) => {
        post.descendents++;
        return post.save();
      });
  }));
});

const Post = gstore.model('Post', schema);

module.exports = {
  getTopStories: () => {
    const query = Post.query()
      .filter('level', '=', 0)
      // .order('createdOn', { descending: true })
      .limit(25);

    return query.run().then((response) => {
      const stories = response.entities.map(post => post.plain({virtuals: true}));
      return { stories: stories };
    });
  },

  getStoryAndComments: (storyId) => {
    const query = Post.query()
      .hasAncestor(Post.key(storyId))
      // .order('createdOn', { descending: true });

    return query.run().then((response) => {
      const posts = response.entities.map(post => post.plain({virtuals: true}));
      const [story, ...comments] = posts;
console.log(response.entities)
      return {
        story: story,
        comments: comments
      };
    });
  },

  createStory: (data) => {
    const post = new Post(Post.sanitize(data));

    post.level = 0;

    return post
      .save()
      .then(post => post.plain({virtuals: true}))
      .catch(err => {
        console.error(err);
      });
  },

  createComment: (data) => {
    const path = data.path
      .split('/')
      .reduce((arr, el) => arr.concat(['Post', parseInt(el)]), []);

    const post = new Post(Post.sanitize(data), null, path);

    post.level = path.length / 2;

    return post
      .save()
      .then(post => post.plain({virtuals: true}))
      .catch(err => {
        console.error(err);
      });
  }
}
